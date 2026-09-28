import { Router } from 'express';
import { penaltyController } from '../controllers/penaltyController.js';

const router = Router();

router.get('/', (req, res) => penaltyController.getPenalties(req, res));
router.post('/', (req, res) => penaltyController.createManualPenalty(req, res));
router.get('/:id', (req, res) => penaltyController.getPenaltyById(req, res));
router.patch('/:id/status', (req, res) => penaltyController.updateStatus(req, res));
router.post('/:id/dispute', (req, res) => penaltyController.submitDispute(req, res));

export default router;
