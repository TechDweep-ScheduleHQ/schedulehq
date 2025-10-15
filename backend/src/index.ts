import {Router} from 'express';
import authRoutes from './Routes/auth';
import onboardRoutes from './Routes/onboarding';
import eventRoutes from './Routes/event';

const router = Router();

router.use('/auth',authRoutes);
router.use('/onboard',onboardRoutes);
router.use('/event',eventRoutes);


export default router;