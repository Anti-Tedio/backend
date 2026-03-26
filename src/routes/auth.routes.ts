import z from "zod";
import { Hono } from "hono";
import { googleAuth } from '@hono/oauth-providers/google'
import { facebookAuth } from '@hono/oauth-providers/facebook';
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../lib/auth-plugin";
import { authController } from "../controllers/internal/auth.controller";

type Variables = {
    user: {
        id: string
        isAdmin: boolean
    }
}

const authRoutes = new Hono<{ Variables: Variables }>();

export const loginSchema = z.object({
    email: z.email({ message: "E-mail inválido" }),
    password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(1, { message: "Nome é obrigatório" })
});

authRoutes.post('/login', zValidator('json', loginSchema), authController.login)
authRoutes.post('/logout', authMiddleware, authController.logout)
authRoutes.post('/register', zValidator('json', registerSchema), authController.register)
authRoutes.post('/verify', zValidator('json', z.object({ email: z.email({ message: "E-mail inválido" }), code: z.string().length(6) })), authController.verify)

authRoutes.post('/delete-account', authMiddleware, authController.delete)
authRoutes.post('/recovery-account', authController.recoveryAccount)

authRoutes.post('/change-password', zValidator('json', z.object({ newPassword: z.string().min(8) })), authMiddleware, authController.changePassword);
authRoutes.post('/reset-password', zValidator('json', z.object({ password: z.string().min(8), token: z.string().min(36), userId: z.string().min(25).max(30) })), authController.resetPassword)
authRoutes.post('/reset-password/request', zValidator('json', z.object({ email: z.email({ message: "E-mail inválido" }) })), authController.reqResetPassword)

authRoutes.use(
    '/google',
    googleAuth({
        client_id: Bun.env.GOOGLE_CLIENT_ID,
        client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${Bun.env.BACKEND_URL}/auth/google`,
        scope: ['openid', 'email', 'profile'],
    }),
    authController.google
)

authRoutes.use(
    '/facebook',
    facebookAuth({
        client_id: Bun.env.FACEBOOK_CLIENT_ID,
        client_secret: Bun.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: `${Bun.env.BACKEND_URL}/auth/facebook`,
        scope: ['email', 'public_profile'],
        fields: [
            'email',
            'id',
            'name',
            'picture',
        ],
    }),
    authController.facebook
)

export { authRoutes }