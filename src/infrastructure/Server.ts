import express from 'express';
import cors from 'cors';
import { LoginAdminController } from '../presentation/controllers/LoginAdminController';
import session from 'express-session';
import { LogoutAdminController } from '../presentation/controllers/LogoutAdminController';

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
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          maxAge: 900000,
        },
      }),
    );

    app.get('/', (req, res) => res.send('Admin server is running'));

    app.post('/login', (req, res) =>
      controllers.loginAdminController.handle(req, res),
    );

    app.post('/logout', (req, res) =>
      controllers.logoutAdminController.handle(req, res),
    );

    app.listen(port, () => {
      console.log(`Admin server is running in ${port}`);
    });
  }
}
