import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: "e-billing@gmail.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
