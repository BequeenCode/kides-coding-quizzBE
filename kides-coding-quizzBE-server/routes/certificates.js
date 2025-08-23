const express = require('express');
const CertificateTemplate = require('../models/CertificateTemplate');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get certificate template
router.get('/template', auth, async (req, res) => {
  try {
    let template = await CertificateTemplate.findOne();
    
    if (!template) {
      // Create default template if none exists
      template = new CertificateTemplate();
      await template.save();
    }
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update certificate template (admin only)
router.put('/template', auth, adminAuth, async (req, res) => {
  try {
    const { logoUrl, templateText } = req.body;
    
    let template = await CertificateTemplate.findOne();
    
    if (!template) {
      template = new CertificateTemplate({ logoUrl, templateText });
    } else {
      template.logoUrl = logoUrl;
      template.templateText = templateText;
      template.updatedAt = new Date();
    }
    
    await template.save();
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;