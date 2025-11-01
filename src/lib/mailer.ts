import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  // Get email and app code from environment variables
  const email = process.env.EMAIL || process.env.SMTP_EMAIL || process.env.SMTP_USER;
  const appCode = process.env.APP_CODE || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.APP_PASSWORD;
  const mailFrom = process.env.MAIL_FROM || `"Wooden Art" <${email}>` || 'no-reply@woodenart.local';

  // Use Gmail with App Password (just email + app code)
  if (email && appCode) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail service (automatically sets host, port, secure)
        auth: {
          user: email, // Your Gmail address
          pass: appCode, // Your Gmail App Password (16-character code)
        },
      });

      // Send email
      const info = await transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        html,
      });

      console.log('Email sent successfully:', info.messageId);
      return;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Fallback: Log to console if email/app code not configured
  console.warn('[EMAIL-DEV] Email not configured. Email would be sent to:', to);
  console.warn('[EMAIL-DEV] Subject:', subject);
  console.warn('[EMAIL-DEV] Add EMAIL and APP_CODE to .env to enable email sending');
  // console.log('[EMAIL-DEV] HTML:', html);
  
  // In development, don't throw error if not configured
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  
  throw new Error('Email configuration missing. Please add EMAIL and APP_CODE to .env file');
}


