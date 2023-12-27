import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';

export class LogoutAdminController implements IController {
  public async handle(req: Request, res: Response): Promise<void> {
    req.session.destroy(err => {
        if(err) {
          return res.send({ success: false, message: 'Could not log out, please try again' });
        }
        
        res.clearCookie('connect.sid');
        return res.send({ success: true, message: 'Logged out' });
      });
  }
}