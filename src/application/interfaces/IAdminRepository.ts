import { Admin } from "../../domain/entities/Admin";

export interface IAdminRepository {
  login(email: string): Promise<Admin | null>;
}
