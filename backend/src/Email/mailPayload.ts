import { sendEmail } from "../Email/email";
import { emailTemplate } from "./mailTemplate";

// Define payload types per template
interface EmailVerificationPayload {
  email: string;
  token: string;
  cc?: string[];
}

interface EmailForgotPasswordPayload {
  email: string;
  resetUrl: string;
  cc?: string[]
}

// Template type mapping
type TemplatePayloads = {
  email_verification: EmailVerificationPayload;
  forgot_password: EmailForgotPasswordPayload;
};

export const mailPayload = async <T extends keyof TemplatePayloads>(
  template_id: T,
  payload: TemplatePayloads[T]
) => {
  let template;

  switch (template_id) {
    case "email_verification":
      template = emailTemplate.emailVerification(payload as EmailVerificationPayload);
      break;
    case "forgot_password":
       template = emailTemplate.emailForgotPassword(payload as EmailForgotPasswordPayload);
       break;
    default:
      throw new Error("Invalid template_id");
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: (payload as any).email, 
    cc: "cc" in payload && payload.cc ? payload.cc : [],
    subject: template.subject,
    html: template.html,
  };

  return await sendEmail(mailOptions);
};
