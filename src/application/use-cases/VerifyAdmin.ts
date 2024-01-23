import { IAdminRepository } from '../interfaces/IAdminRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IVerifyAdminDTO {
  adminId: string;
}

export class VerifyAdmin implements IUseCase<IVerifyAdminDTO, void> {
  public constructor(private readonly _adminRepo: IAdminRepository) {}

  public async execute(input: IVerifyAdminDTO): Promise<void | Error> {
    const admin = await this._adminRepo.findAdminById(input.adminId);

    if (!admin) {
      return new Error("Admin don't exist");
    }
  }
}
