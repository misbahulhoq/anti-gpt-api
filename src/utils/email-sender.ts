import nodemailer from 'nodemailer';

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail = async (body: {
  to: string;
  subject: string;
  html: string;
}) => {
  const { to, subject, html } = body;

  // Send email must be awaited to work properly on a serverless architecture.
  await mailTransporter
    .sendMail({
      from: `"AntiGPT" <${process.env.EMAIL_USER}>`,
      to: to,
      subject,
      html: html,
    })
    .then((res) => {
      console.log('res', res);
    })
    .catch((err) => {
      console.error('error', err);
    });
};
