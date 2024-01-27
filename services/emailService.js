const { envsConfig } = require('../configs');

const nodeMailer = require('nodemailer');



const Transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: envsConfig.email,
    pass: envsConfig.gmailKey
  },
});


// const confirmEmail = {
//   subject: 'email verification',
//   from: envsConfig.email,
//   to: 'svopyp@gmail.com',
//   html: '<h2>HI! Testing email verification</h2>'
// };

const confirmEmail = async (data) => {
  const email = { ...data, from: envsConfig.email };
  await Transporter.sendMail(email);
  return true;
};

module.exports = confirmEmail;





// const brevo = require('@getbrevo/brevo');
// const apiInstance = new brevo.TransactionalEmailsApi();

// apiInstance.authentications.apiKey.apiKey = envsConfig.brevoApiKey;

// const confirmEmail = {
//   subject: 'email verification',
//   sender: { email: envsConfig.email, name: 'Serhii' },
//   to: [{ email: 'svopyp@gmail.com', name: 'Serhii' }],
//   htmlContent: '<html><body><h2>HI! Testing email verification</h2></body></html>'
// };


// apiInstance.sendTransacEmail(confirmEmail).then(() => console.log('Отправлен удачно')).catch(err => console.log(err.message))

// module.exports = apiInstance;