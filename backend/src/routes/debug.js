import express from 'express';
import { LicenseService } from '../services/licenseService.js';

const router = express.Router();
const licenseService = new LicenseService();

router.post('/reset-trial', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, error: 'DEV-ONLY endpoint' });
  }
  
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email required' });
    }
    
    const result = licenseService.resetTrial(email);
    res.json(result);
  } catch (error) {
    console.error('Reset trial error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
