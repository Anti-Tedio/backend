import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { getCookie, setCookie } from 'hono/cookie';
import { logger } from 'hono/logger';

import { userRoutes } from "./routes/user.routes";
import { personRoutes } from "./routes/person.routes";
import { categoryRoutes } from "./routes/category.routes";
import { userPersonRoutes } from "./routes/userPerson.routes";
import { historyRoutes } from "./routes/history.routes";
import { aiRoutes } from "./routes/ai.routes";
import { authRoutes } from './routes/auth.routes';
import { manageRefreshToken } from './lib/manageRefreshToken';
import { redis } from 'bun';
import { paymentRoutes } from './routes/payment.routes';
import { webhookRoutes } from './routes/webhook.routes';
import { productRoutes } from './routes/product.routes';
import { contactRoutes } from './routes/contact.routes';

const app = new Hono();

await redis.connect();

app.use('*', logger());
app.use('*', cors({
  origin: ['https://antitedio.com.br','https://preview.antitedio.com.br'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const ACCESS_SECRET = Bun.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = Bun.env.JWT_REFRESH_SECRET!;

app.get("/health", (c) => c.text("Está tudo certo por aqui dev!"));

app.post('/refresh', async (c) => {
  const refreshToken = getCookie(c, 'refreshToken');
  if (!refreshToken) return c.json({ error: "Refresh token ausente" }, 400);

  try {
    const payload = await verify(refreshToken, REFRESH_SECRET, 'HS256');
    const userId = String(payload?.id);

    const isValid = await manageRefreshToken.verify(userId, refreshToken);
    if (!isValid) return c.json({ error: 'Token inválido ou expirado' }, 403);

    const newRefreshToken = await manageRefreshToken.generate(userId, !!payload.isAdmin);
    const newAccessToken = await sign({
      id: userId,
      isAdmin: payload.isAdmin,
      exp: Math.floor(Date.now() / 1000) + (60 * 15),
    }, ACCESS_SECRET);

    await manageRefreshToken.remove(userId);
    await manageRefreshToken.save(userId, newRefreshToken);

    setCookie(c, 'refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return c.json({ accessToken: newAccessToken });
  } catch (e) {
    return c.json({ error: "Sessão inválida" }, 401);
  }
});

app.route('/user', userRoutes);
app.route('/person', personRoutes);
app.route('/user-person', userPersonRoutes);
app.route('/category', categoryRoutes);
app.route('/history', historyRoutes);
app.route('/ai', aiRoutes);
app.route('/auth', authRoutes);
app.route('/payment', paymentRoutes);
app.route('/webhooks', webhookRoutes);
app.route('/product', productRoutes);
app.route('/contact', contactRoutes)

export default {
  port: 3001,
  fetch: app.fetch,
};

console.log(`🔥 Hono is running at http://localhost:3001`);