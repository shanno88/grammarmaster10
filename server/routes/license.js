import express from 'express';
import { LicenseService } from '../services/licenseService.js';

const router = express.Router();
const licenseService = new LicenseService();

router.get('/list', async (req, res) => {
  try {
    const licenses = await licenseService.getAllLicenses();
    res.json({ success: true, licenses });
  } catch (error) {
    console.error('Get licenses error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/machine/:machineId', async (req, res) => {
  try {
    const { machineId } = req.params;
    const licenses = await licenseService.getLicensesByMachineId(machineId);
    res.json({ success: true, licenses });
  } catch (error) {
    console.error('Get licenses by machineId error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const license = await licenseService.getLicenseByEmail(email);
    if (license) {
      res.json({ success: true, license });
    } else {
      res.status(404).json({ success: false, error: 'License not found' });
    }
  } catch (error) {
    console.error('Get license by email error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const license = await licenseService.getLicenseById(id);
    if (license) {
      res.json({ success: true, license });
    } else {
      res.status(404).json({ success: false, error: 'License not found' });
    }
  } catch (error) {
    console.error('Get license error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { machineId, code } = req.body;

    if (!machineId || !code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: machineId, code' 
      });
    }

    const result = await licenseService.verifyLicenseCode(machineId, code);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Verify license error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/:id/regenerate', async (req, res) => {
  try {
    const { id } = req.params;
    const license = await licenseService.regenerateLicense(id);
    res.json({ success: true, license });
  } catch (error) {
    console.error('Regenerate license error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const license = await licenseService.deleteLicense(id);
    if (license) {
      res.json({ success: true, license });
    } else {
      res.status(404).json({ success: false, error: 'License not found' });
    }
  } catch (error) {
    console.error('Delete license error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
