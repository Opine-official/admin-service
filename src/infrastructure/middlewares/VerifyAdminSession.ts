import { Request, Response, NextFunction } from 'express';
import { VerifyAdmin } from '../../application/use-cases/VerifyAdmin';

export function verifyAdminSession(verifyAdmin: VerifyAdmin) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.session);
    console.log(req.session.adminId);
    const adminId = req.session.adminId;

    if (!adminId) {
      res.status(401).json({ error: 'No adminId, Unauthorized' });
      return;
    }

    const result = await verifyAdmin.execute({ adminId });

    if (result instanceof Error) {
      res
        .status(401)
        .json({ error: 'AdminId verification failed, Unauthorized' });
      return;
    }

    next();
  };
}
