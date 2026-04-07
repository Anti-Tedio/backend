import { Context } from "hono";
import { db } from "../../lib/prisma";
import { manageRefreshToken } from "../../lib/manageRefreshToken";
import { deleteCookie, setCookie } from "hono/cookie";
import { sendEmail } from "../../lib/email/mailer";
import { buildVerificationEmail } from "../../lib/email/verification-template";
import { buildAccountDeletionEmail } from "../../lib/email/deleteAccount-template";
import { redis } from "bun";
import { buildPasswordResetEmail } from "../../lib/email/passwordReset";

const CODE_VERIFICATION_EXPIRY_MINUTES = 15
const TOKEN_PASSWORD_RESET_HOURS = 2
const TOKEN_RECOVERY_ACCOUNT_DAYS = 30

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 999999).toString();
}

export const authController = {
    register: async (c: Context) => {
        const { email, password, name } = await c.req.json()
        const code = generateCode()

        const expiresAt = new Date(Date.now() + CODE_VERIFICATION_EXPIRY_MINUTES * 60 * 1000)

        const hashPassword = await Bun.password.hash(password)

        await db.email_Verification.create({
            data: { email, password: hashPassword, name, code, expiresAt },
        })

        await sendEmail({
            to: email,
            subject: 'Seu código de verificação',
            html: buildVerificationEmail(code, name),
        })

        return c.json({ ok: true, message: 'E-mail de verificação enviado!' }, 201)
    },

    verify: async (c: Context) => {
        const { email, code } = await c.req.json()

        const record = await db.email_Verification.findFirst({
            where: { email, code },
        })

        if (!record) {
            return c.json({ ok: false, message: 'Invalid code' }, 404)
        }

        const isExpired = new Date() > record.expiresAt

        if (isExpired) {
            const newCode = generateCode()
            const expiresAt = new Date(Date.now() + CODE_VERIFICATION_EXPIRY_MINUTES * 60 * 1000)
            await db.email_Verification.update({ where: { email: record.email }, data: { code: newCode, expiresAt } }).then(async () => {
                await sendEmail({
                    to: record.email,
                    subject: 'Seu código de verificação',
                    html: buildVerificationEmail(newCode, record.name),
                })
            })
            return c.json({ ok: false, message: 'Code expired, new code being sent...' }, 410)
        }

        await db.$transaction([
            db.email_Verification.delete({
                where: { email },
            }),
            db.user.create({
                data: { id: record.id, email, name: record.name, password: record.password },
            }),
        ])

        const token = await manageRefreshToken.generate(record.id)

        await manageRefreshToken.save(record.id, token);

        setCookie(c, 'refreshToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
            sameSite: 'Strict',
            secure: true
        })

        return c.json({ ok: true, message: 'verificação feita com sucesso' }, 201)
    },

    login: async (c: Context) => {
        const { email, password } = await c.req.json()

        const user = await db.user.findUnique({ where: { email, deleteAt: null } })

        if (!user) {
            return c.json({ ok: false, error: "Credenciais inválidas" }, 401)
        }

        if (!user.password) return c.json({ ok: false, error: 'Método de login errado' }, 409)

        const match = await Bun.password.verify(password, user.password)

        if (!match) {
            return c.json({ ok: false, error: "Credenciais inválidas" }, 401)
        }

        const token = await manageRefreshToken.generate(user.id, user.isAdmin)

        await manageRefreshToken.save(user.id, token);

        setCookie(c, 'refreshToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
            sameSite: 'Strict',
            secure: true
        })

        return c.json({ ok: true })
    },

    logout: async (c: Context) => {
        const user = c.get('user')
        await manageRefreshToken.remove(user.id)
        deleteCookie(c, 'refreshToken');
        return c.json({ ok: true, message: 'Logged out' });
    },

    delete: async (c: Context) => {
        const user = c.get('user')

        const userDeleted = await db.user.update({ where: { id: user.id }, data: { deleteAt: new Date() } });

        if (!userDeleted) return c.json({ ok: false, message: 'User not found' }, 404);

        await manageRefreshToken.remove(user.id);

        deleteCookie(c, 'refreshToken');

        const token = Bun.randomUUIDv7()

        await redis.set(`account_recovery_token:${user.id}`, token);
        await redis.expire(`account_recovery_token:${user.id}`, TOKEN_RECOVERY_ACCOUNT_DAYS * 24 * 60 * 60)

        const magicLink = `${Bun.env.FRONTEND_URL}/recovery-account/?token=${token}&userId=${user.id}`

        await sendEmail({
            to: userDeleted.email,
            subject: 'Sua conta no Anti-Tédio foi encerrada',
            html: buildAccountDeletionEmail(userDeleted.name, magicLink, userDeleted.credits)
        })

        return c.json({ ok: true, message: 'Conta apagada com sucesso' }, 201)
    },

    recoveryAccount: async (c: Context) => {
        const { token, userId } = await c.req.json();

        if (!token) {
            return c.json({ error: 'Token missing' }, 401)
        }

        const tokenRedis = await redis.get(`account_recovery_token:${userId}`);

        if (!tokenRedis) return c.json({ error: 'Token Expirado' }, 403);

        if (token != tokenRedis) return c.json({ error: 'User Unauthorized' }, 401);

        await db.user.update({ where: { id: userId }, data: { deleteAt: null } });

        await redis.del(`account_recovery_token:${userId}`);

        return c.json({ ok: true }, 200);
    },

    changePassword: async (c: Context) => {
        const { newPassword } = await c.req.json();
        const user = c.get('user')


        const userDB = await db.user.findUnique({ where: { id: user.id } });

        if (!userDB) return c.json({ ok: false, message: 'Usuário não encontrado' }, 404);

        const hashNewPassword = await Bun.password.hash(newPassword)

        await db.user.update({ where: { id: user.id }, data: { password: hashNewPassword } });

        return c.json({ ok: true, message: 'Senha alterada com sucesso' }, 201);
    },

    resetPassword: async (c: Context) => {
        const { password, userId, token } = await c.req.json();

        if (!token) return c.json({ error: 'Token missing' }, 401)

        const tokenRedis = await redis.get(`password_reset_token:${userId}`);

        if (!tokenRedis) return c.json({ error: 'Token Expirado' }, 403);

        if (token != tokenRedis) return c.json({ error: 'User Unauthorized' }, 401);

        const hashPassword = await Bun.password.hash(password)

        const user = await db.user.update({ where: { id: userId }, data: { password: hashPassword } });

        if (!user) return c.json({ ok: false, message: 'Usuário não encontrado' }, 404);

        await redis.del(`password_reset_token:${userId}`)

        return c.json({ ok: true, message: 'Usuário Recuperado com sucesso' }, 201)
    },

    reqResetPassword: async (c: Context) => {
        const { email } = await c.req.json();

        const user = await db.user.findUnique({ where: { email } })

        if (!user) return c.json({ ok: false, message: 'Usuário não encontrado' }, 404);

        const token = Bun.randomUUIDv7()

        await redis.set(`password_reset_token:${user.id}`, token);
        await redis.expire(`password_reset_token:${user.id}`, TOKEN_PASSWORD_RESET_HOURS * 60 * 60)

        const magicLink = `${Bun.env.FRONTEND_URL}/reset-password/?token=${token}&userId=${user.id}`

        await sendEmail({
            to: user.email,
            subject: 'Recuperação de senha - Anti-Tédio',
            html: buildPasswordResetEmail(user.name, magicLink)
        })

        return c.json({ ok: true, message: 'Email enviado com sucesso' }, 201)
    },

    google: async (c: Context) => {
        const userGoogle = c.get('user-google');
        const tokenGoogle = c.get('token')

        if (!userGoogle) return c.json({ ok: false, message: 'erro no login com o google' }, 400)

        const { email, name, picture, id } = userGoogle;

        if (!(email && name && picture && id && tokenGoogle)) {
            return c.json({ ok: false, message: 'dados incompletos do google' }, 400)
        }

        const user = await db.user.upsert({
            where: { email, deleteAt: null },
            update: {},
            create: { email, name, avatarUrl: picture }
        })

        await db.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: 'google',
                    providerAccountId: id
                }
            },
            update: {
                accessToken: tokenGoogle.token,
                expiresAt: tokenGoogle.expires_in
            },
            create: {
                provider: 'google',
                providerAccountId: id,
                accessToken: tokenGoogle.token,
                expiresAt: tokenGoogle.expires_in,
                userId: user.id
            }
        })

        const token = await manageRefreshToken.generate(user.id, user.isAdmin);

        await manageRefreshToken.save(user.id, token);

        setCookie(c, 'refreshToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
            secure: true
        })

        return c.redirect(`${Bun.env.FRONTEND_URL}/persons`)
    },

    facebook: async (c: Context) => {
        const userFacebook = c.get('user-facebook');
        const tokenFacebook = c.get('token')

        if (!userFacebook) return c.json({ ok: false, message: 'erro no login com o google' }, 400)

        const { email, name, picture, id } = userFacebook;

        if (!(email && name && picture && id && tokenFacebook)) {
            return c.json({ ok: false, message: 'dados incompletos do google' }, 400)
        }

        const user = await db.user.upsert({
            where: { email, deleteAt: null },
            update: {},
            create: { email, name, avatarUrl: picture.data.url }
        })

        await db.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: 'facebook',
                    providerAccountId: id
                }
            },
            update: {
                accessToken: tokenFacebook.token,
                expiresAt: tokenFacebook.expires_in
            },
            create: {
                provider: 'facebook',
                providerAccountId: id,
                accessToken: tokenFacebook.token,
                expiresAt: tokenFacebook.expires_in,
                userId: user.id
            }
        })

        const token = await manageRefreshToken.generate(user.id, user.isAdmin);

        await manageRefreshToken.save(user.id, token);

        setCookie(c, 'refreshToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
            secure: true
        })

        return c.redirect(`${Bun.env.FRONTEND_URL}/persons`)
    }
}