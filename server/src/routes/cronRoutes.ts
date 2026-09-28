import { Router } from 'express';
import { cronController } from '../controllers/cronController.js';

const router = Router();

router.post('/prosecution/run', (req, res) => cronController.triggerProsecution(req, res));

export default router;
