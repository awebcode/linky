import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { envConfig } from "./env.config";
import { AppError } from "../middlewares/errors-handle.middleware";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: envConfig.smtpHost, // SMTP server from envConfig
  port: envConfig.smtpPort, // Port from envConfig
  secure: envConfig.smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: envConfig.smtpUser, // Email from envConfig
    pass: envConfig.smtpPass, // Password from envConfig
  },
});

// Function to send email
export const sendEmail = async (
  to: string,
  name: string,
  subject: string,
  message: string,
  buttonLink: string
) => {
  // Load the HTML email template
  const templatePath = path.join(__dirname, "../public/emailTemplate.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual values
  template = template.replace("{{title}}", subject);
  template = template.replace("{{name}}", name);
  template = template.replace("{{message}}", message);
  template = template.replace("{{link}}", buttonLink);
  template = template.replace("{{buttonText}}", "Get Started");

  // Set up email data
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${envConfig.fromName}" <${envConfig.fromEmail}>`, // sender address
    to, // recipient
    subject, // Subject line
    html: template, // HTML body content
  };

  // Send email with transporter object
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.response);

    return info;
  } catch (error) {
    throw new AppError("Failed to send email or Invalid credentials", 500);
  }
};

//* Example usage
// sendEmail(
//   "recipient@example.com",
//   "John Doe",
//   "Welcome to Our Platform!",
//   "Thank you for joining us. Click the link below to get started:",
//   "https://example.com/welcome"
// );
