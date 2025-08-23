const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    default: ''
  },
  templateText: {
    type: String,
    default: 'Congratulations {name}! You scored {score}% in {topic}.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);