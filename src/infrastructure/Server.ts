import express from 'express';
import cors from 'cors';
import { LoginAdminController } from '../presentation/controllers/LoginAdminController';
import { LogoutAdminController } from '../presentation/controllers/LogoutAdminController';
// import { verifyAdminSession } from './middlewares/VerifyAdminSession';
// import { VerifyAdmin } from '../application/use-cases/VerifyAdmin';
import cookieParser from 'cookie-parser';
import { authenticateAdmin } from '@opine-official/authentication';

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
    // verifyAdmin: VerifyAdmin,
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    app.post('/login', (req, res) =>
      controllers.loginAdminController.handle(req, res),
    );

    app.post('/logout', (req, res) =>
      controllers.logoutAdminController.handle(req, res),
    );

    app.get('/verify', authenticateAdmin, (req, res) => {
      res.status(200).json('admin verified');
    });

    // app.use(verifyAdminSession(verifyAdmin));

    // app.get('/');

    app.listen(port, () => {
      console.log(`Admin server is running in ${port}`);
    });
  }
}
