import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import {
  LoginAdmin,
  ILoginAdminResult,
} from '../../application/use-cases/LoginAdmin';

export class LoginAdminDTO implements ILoginAdminResult {
  public readonly adminId: string;

  public constructor(id: string) {
    this.adminId = id;
  }
}



export class LoginAdminController implements IController {
  public constructor(private readonly _useCase: LoginAdmin) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      email: req.body.email,
      password: req.body.password,
    });

    if (result instanceof Error) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    req.session.adminId = result.adminId;

    const response: ILoginAdminResult = {
      adminId: result.adminId,
    };

    res.status(200).json(response);
  }
}
