import express from 'express';
import { LoginAdminController } from './controllers/LoginAdminController';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    adminId: string;
  }
}

interface ServerControllers {
  loginAdminController: LoginAdminController;
}

export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      }),
    );

    app.get('/admin', (req, res) => res.send('Admin server is running'));

    app.post('/login', (req, res) =>
      controllers.loginAdminController.handle(req, res),
    );

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
