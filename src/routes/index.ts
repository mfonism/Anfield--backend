import { Router } from 'express';
import CabinetRouter from './Cabinet';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/trophies', CabinetRouter);

// Export the base-router
export default router;
