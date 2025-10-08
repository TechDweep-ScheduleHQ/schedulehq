const emailHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { 
      padding: 10px 0; 
      text-align: center; 
      background-color: #000000; 
      color: #ffffff; 
    }
    .content { padding: 20px; text-align: center; line-height: 1.5; }
    .button { display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { padding: 10px 0; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
    a { color: #777777; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ScheduleHQ SaaS</h1>
    </div>
`;

const emailFooter = `
    <div class="footer">
      <p>&copy; 2025 VR Automations. All rights reserved.</p>
      <p><a href="https://yourdomain.com/unsubscribe" style="color: #777777; text-decoration: underline;">Unsubscribe</a> | <a href="https://yourdomain.com/contact" style="color: #777777; text-decoration: underline;">Contact Us</a></p>
      <p>123 Main Street Mohali, India</p>
    </div>
    </div>
  </body>
  </html>
`;


const emailVerification = ({ email, token }: { email: string; token : string }) => {
  return {
    subject: 'Verify Your Email',
    html: `
      ${emailHeader}
      <div class="content">
        <p>Thank you for signing up with ScheduleHQSaaS! Please verify your email address <strong>${email}</strong> to complete your registration.</p>
        <p>Click the link below to verify your email:</p>
        <a href="http://localhost:5173/emailLogin?token=${token}" class="button" style="color: #ffffff">Verify Email</a>
        <p>This link is valid for 24 hours. If you did not request this, please ignore this email.</p>
      </div>
      ${emailFooter}
    `,
  };
};



const emailForgotPassword = ({ email, resetUrl }: { email: string; resetUrl: string }) => {
  return {
    subject: 'Reset Your Password - ScheduleHQSaaS',
    html: `
      ${emailHeader}
      <div class="content" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello <strong>${email}</strong>,</p>
        <p>We received a request to reset your password for your ScheduleHQSaaS account.</p>
        <p>Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        
        <p>If you didn’t request a password reset, you can safely ignore this email. 
           Your password will remain unchanged.</p>
      </div>
      ${emailFooter}
    `,
  };
};




export const emailTemplate = {
  emailVerification,
  emailForgotPassword
};
