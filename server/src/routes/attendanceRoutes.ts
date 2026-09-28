import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController.js';

const router = Router();

router.get('/', (req, res) => attendanceController.getDailyAttendance(req, res));
router.post('/sync', (req, res) => attendanceController.syncAttendance(req, res));

export default router;
