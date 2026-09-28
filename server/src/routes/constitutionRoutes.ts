import { Router } from 'express';
import { constitutionController } from '../controllers/constitutionController.js';

const router = Router();

router.get('/', (req, res) => constitutionController.getAllRules(req, res));
router.get('/export-pdf', (req, res) => constitutionController.exportPdf(req, res));
router.patch('/:id', (req, res) => constitutionController.updateRule(req, res));

export default router;
