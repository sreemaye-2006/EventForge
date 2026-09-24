const QRCode = require('qrcode');

/**
 * Generate a QR code from string data
 * @param {string} data - Data to encode in QR
 * @returns {Promise<string>} - Base64 encoded Data URI of the QR code image
 */
const generateQRCode = async (data) => {
  try {
    const url = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return url;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = {
  generateQRCode
};
