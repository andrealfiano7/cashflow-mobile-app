import type { Plugin } from 'vite';
import { authenticateUser, signToken, createAuthCookie, clearAuthCookie, extractTokenFromCookies, verifyToken, getUserById, SEED_USERS } from './src/server/authHandler.ts';

export function viteAuthPlugin(): Plugin {
  return {
    name: 'vite-auth-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/auth/login' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const { email, password } = body;
              if (!email || !password) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Email dan password wajib diisi' }));
                return;
              }
              const user = authenticateUser(email, password);
              if (!user) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Email atau password salah' }));
                return;
              }
              const token = signToken(user);
              const cookieHeader = createAuthCookie(token);
              res.statusCode = 200;
              res.setHeader('Set-Cookie', cookieHeader);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Login berhasil', user }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Terjadi kesalahan server' }));
            }
          });
          return;
        }

        if (url === '/api/auth/me' && req.method === 'GET') {
          const cookieHeader = req.headers.cookie;
          const token = extractTokenFromCookies(cookieHeader);
          if (!token) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ authenticated: false, error: 'Belum login' }));
            return;
          }
          const payload = verifyToken(token);
          if (!payload || !payload.sub) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ authenticated: false, error: 'Token tidak valid' }));
            return;
          }
          const user = getUserById(payload.sub);
          if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ authenticated: false, error: 'User tidak ditemukan' }));
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ authenticated: true, user }));
          return;
        }

        if (url === '/api/auth/logout' && (req.method === 'POST' || req.method === 'GET')) {
          res.statusCode = 200;
          res.setHeader('Set-Cookie', clearAuthCookie());
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Logout berhasil' }));
          return;
        }

        if (url === '/api/auth/users' && req.method === 'GET') {
          const users = SEED_USERS.map(({ passwordHash, ...safeUser }) => safeUser);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ users }));
          return;
        }

        next();
      });
    },
  };
}
