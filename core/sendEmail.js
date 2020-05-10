// Nodemailer (https://www.npmjs.com/package/nodemailer)
const nodemailer = require('nodemailer');

// Configuration
const config = require('./config');

// Export que query function
module.exports = async (to, subject, text, html) => {
  // create reusable transporter object using the default SMTP transport
  let transporter;

  // Check if is a test email
  if (config.email.test === 'true') {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else if (config.email.service === 'gmail') {
    transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  } else {
    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  // send mail with defined transport object
  return await transporter.sendMail({
    from: config.email.user,
    to,
    subject,
    text,
    html,
  });
};
