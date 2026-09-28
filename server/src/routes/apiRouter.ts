import { Router } from 'express';
import penaltyRoutes from './penaltyRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import constitutionRoutes from './constitutionRoutes.js';
import cronRoutes from './cronRoutes.js';
import statsRoutes from './statsRoutes.js';

const apiRouter = Router();

apiRouter.use('/penalties', penaltyRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/constitution', constitutionRoutes);
apiRouter.use('/cron', cronRoutes);
apiRouter.use('/stats', statsRoutes);

export default apiRouter;
