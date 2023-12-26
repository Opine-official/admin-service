import { LoginAdmin } from './application/use-cases/LoginAdmin';
import { AdminRepository } from './infrastructure/repositories/AdminRepository';
import { Server } from './presentation/Server';
import { LoginAdminController } from './presentation/controllers/LoginAdminController';

export async function main() {
  const adminRepo = new AdminRepository();
  const loginAdmin = new LoginAdmin(adminRepo);
  const loginAdminController = new LoginAdminController(loginAdmin);

  await Server.run(5000, {
    loginAdminController,
  });
}
