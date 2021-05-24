import express from 'express';

import { createAuthCode, verifyAuthCode } from '../controllers/twoFactorController';

const router = express.Router();

// Two Factor Routes

router.post('/createAuthCode', createAuthCode);
router.post('/verifyAuthCode', verifyAuthCode)

export default router;