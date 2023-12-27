import { IAdminRepository } from '../interfaces/IAdminRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import bcrypt from 'bcrypt';

interface ILoginAdminDTO {
  email: string;
  password: string;
}

export interface ILoginAdminResult {
  adminId: string;
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
        return new Error('Invalid password');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error;
      }

      return new Error('Password comparison failed');
    }

    return {
      adminId: admin.adminId,
    };
  }
}
