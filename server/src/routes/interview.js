import { Router } from 'express';
import {
  startQuestion,
  submitAnswer,
  finishSession,
  getSessions,
} from '../controllers/interviewController.js';

const router = Router();

router.post('/question', startQuestion);
router.post('/answer', submitAnswer);
router.post('/finish', finishSession);
router.get('/sessions', getSessions);

export default router;
