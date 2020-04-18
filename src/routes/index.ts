import { Router } from 'express';
import UserRouter from './Users';
import CabinetRouter from './Cabinet';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/cabinet', CabinetRouter);

// Export the base-router
export default router;
