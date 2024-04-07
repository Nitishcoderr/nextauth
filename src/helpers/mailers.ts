import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      if (emailType === "VERIFY") {
          const updateUser = await User.findByIdAndUpdate(userId, {
              $set: {
                  verifyToken: hashedToken,
                  verifyTokenExpiry: new Date(Date.now() + 3600000)
              }
          });
          console.log("Updated User for VERIFY",updateUser);
          
      } else if (emailType === "RESET") {
          await User.findByIdAndUpdate(userId, {
             $set:{ forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry:new Date(Date.now() + 3600000)}
          });
      }

      const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
              user: "f48119cc5be33c",
              pass: "65ed8db7810118"
          }
      });

      const mailOptions = {
          from: 'tripathireetish@gmail.com', // sender address
          to: email,
          subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
          html: `<p>Click <a href=${process.env.DOMAIN}/verifyemail?token=${hashedToken} >Here</a> to ${
              emailType === "VERIFY" ? "verify your email" : "reset your password"
          } or copy and paste the link below in your browser.<br /> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
      };

      const mailResponse = await transport.sendMail(mailOptions);
      return mailResponse;
  } catch (error: any) {
      throw new Error(error.message);
  }
};
