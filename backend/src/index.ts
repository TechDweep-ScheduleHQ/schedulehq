import {Router} from 'express';
import authRoutes from './Routes/auth';
import onboardRoutes from './Routes/onboarding';

const router = Router();

router.use('/auth',authRoutes);
router.use('/onboard',onboardRoutes);


export default router;