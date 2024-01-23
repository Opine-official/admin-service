import express from 'express';
import cors from 'cors';
import { LoginAdminController } from '../presentation/controllers/LoginAdminController';
import session from 'express-session';
import { LogoutAdminController } from '../presentation/controllers/LogoutAdminController';
import { verifyAdminSession } from './middlewares/VerifyAdminSession';
import { VerifyAdmin } from '../application/use-cases/VerifyAdmin';
import cookieParser from 'cookie-parser';

declare module 'express-session' {
  interface SessionData {
    adminId: string;
  }
}

interface ServerControllers {
  loginAdminController: LoginAdminController;
  logoutAdminController: LogoutAdminController;
}

const corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
    verifyAdmin: VerifyAdmin,
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: true,
          sameSite: 'none',
          maxAge: 900000,
        },
        store: new session.MemoryStore(),
      }),
    );

    app.post('/login', (req, res) =>
      controllers.loginAdminController.handle(req, res),
    );

    app.post('/logout', (req, res) =>
      controllers.logoutAdminController.handle(req, res),
    );

    app.use(verifyAdminSession(verifyAdmin));

    app.get('/');

    app.listen(port, () => {
      console.log(`Admin server is running in ${port}`);
    });
  }
}
