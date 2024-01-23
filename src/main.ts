import { LoginAdmin } from './application/use-cases/LoginAdmin';
import { VerifyAdmin } from './application/use-cases/VerifyAdmin';
import { DatabaseConnection } from './infrastructure/database/Connection';
import { AdminRepository } from './infrastructure/repositories/AdminRepository';
import { Server } from './infrastructure/Server';
import { LoginAdminController } from './presentation/controllers/LoginAdminController';
import { LogoutAdminController } from './presentation/controllers/LogoutAdminController';

export async function main() {
  await DatabaseConnection.connect();
  const adminRepo = new AdminRepository();

  const loginAdmin = new LoginAdmin(adminRepo);
  const verifyAdmin = new VerifyAdmin(adminRepo);

  const loginAdminController = new LoginAdminController(loginAdmin);
  const logoutAdminController = new LogoutAdminController();

  await Server.run(
    5000,
    {
      loginAdminController,
      logoutAdminController,
    },
    verifyAdmin,
  );
}

main();
