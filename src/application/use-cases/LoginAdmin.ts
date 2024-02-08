import { IAdminRepository } from '../interfaces/IAdminRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface ILoginAdminDTO {
  email: string;
  password: string;
}

export interface ILoginAdminResult {
  adminId: string;
  token: string;
}

export class LoginAdmin implements IUseCase<ILoginAdminDTO, ILoginAdminResult> {
  public constructor(private readonly _adminRepo: IAdminRepository) {}

  public async execute(
    input: ILoginAdminDTO,
  ): Promise<ILoginAdminResult | Error> {
    const admin = await this._adminRepo.findAdminByEmail(input.email);

    if (!admin) {
      return new Error("Admin don't exist");
    }

    try {
      const passwordMatch = await bcrypt.compare(
        input.password,
        admin.password,
      );

      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      const SECRET = process.env.ADMIN_JWT_SECRET;

      if (!SECRET) {
        throw new Error('Missing JWT secret');
      }

      const token = jwt.sign({ userId: admin.adminId }, SECRET, {
        expiresIn: '24h',
      });

      return {
        adminId: admin.adminId,
        token,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error;
      }

      return new Error('Password comparison failed');
    }
  }
}
