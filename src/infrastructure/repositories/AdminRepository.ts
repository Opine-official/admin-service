import { AdminModel } from '../models/AdminModel';
import { IAdminRepository } from '../../application/interfaces/IAdminRepository';
import { Admin } from '../../domain/entities/Admin';

export class AdminRepository implements IAdminRepository {
  public async login(email: string): Promise<Admin | null> {
    const adminDocument = await AdminModel.findOne({ email: email });

    if (!adminDocument) {
      return null;
    }

    return new Admin(
      adminDocument.name,
      adminDocument.email,
      adminDocument.password,
      adminDocument.adminId,
    );
  }
}
