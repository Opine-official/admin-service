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
  public constructor(private readonly _userRepo: IAdminRepository) {}

  public async execute(
    input: ILoginAdminDTO,
  ): Promise<ILoginAdminResult | Error> {
    const admin = await this._userRepo.login(input.email);

    if (!admin) {
      return new Error('Admin don\'t exist');
    }

    const passwordMatch = await bcrypt.compare(input.password, admin.password);

    if (!passwordMatch) {
      return new Error('Invalid password');
    }

    return {
      adminId: admin.adminId,
    };
  }
}
