import { Admin } from '../../domain/entities/Admin';

export interface IAdminRepository {
  findAdminByEmail(email: string): Promise<Admin | null>;
  findAdminById(adminId: string): Promise<Admin | null>;
}
