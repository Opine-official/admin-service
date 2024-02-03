import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import {
  LoginAdmin,
  ILoginAdminResult,
} from '../../application/use-cases/LoginAdmin';

export class LoginAdminDTO implements ILoginAdminResult {
  public readonly adminId: string;
  public readonly token: string;

  public constructor(id: string, token: string) {
    this.adminId = id;
    this.token = token;
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
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const response: ILoginAdminResult = {
      adminId: result.adminId,
      token: result.token,
    };

    res
      .cookie('adminToken', result.token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .json(response);
  }
}
