import nodemailer from 'nodemailer';
import type { Lead } from '../drizzle/schema';
import fs from 'fs';
import path from 'path';

/**
 * Email service for sending lead notifications
 * Uses SMTP credentials from environment variables
 */

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

/**
 * Create SMTP transporter
 * Credentials should be provided via environment variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASS
 * - SMTP_FROM
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS environment variables.');
  }

  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

/**
 * Log email events to file
 */
function logEmailEvent(level: 'success' | 'error', message: string, messageId?: string) {
  const logDir = path.join(process.cwd(), '.manus-logs');
  const logFile = path.join(logDir, 'email.log');
  
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${messageId ? ` (${messageId})` : ''}\n`;
    
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('[Email] Failed to write log:', error);
  }
}

/**
 * Generate HTML email template for lead notification
 */
function generateLeadEmailHTML(lead: Partial<Lead>): string {
  const formTypeLabels: Record<string, string> = {
    'b2b': 'B2B Заявка (Юр. лица)',
    'call_specialist': 'Вызов специалиста',
    'calculator': 'Калькулятор стоимости',
  };

  const formTypeLabel = formTypeLabels[lead.formType || ''] || lead.formType;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      color: #FFB800;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .field {
      margin-bottom: 15px;
      padding: 12px;
      background: white;
      border-left: 4px solid #FFB800;
      border-radius: 4px;
    }
    .field-label {
      font-weight: bold;
      color: #555;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .field-value {
      font-size: 16px;
      color: #222;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .urgent {
      background: #fff3cd;
      border-left-color: #ff6b6b;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔔 Новая заявка с сайта</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px;">acahydraulic.kz</p>
  </div>
  
  <div class="content">
    <div class="urgent">
      <strong>⚡ Тип заявки:</strong> ${formTypeLabel}
    </div>

    <div class="field">
      <div class="field-label">👤 Имя</div>
      <div class="field-value">${lead.name || '—'}</div>
    </div>

    <div class="field">
      <div class="field-label">📞 Телефон</div>
      <div class="field-value"><a href="tel:${lead.phone}">${lead.phone || '—'}</a></div>
    </div>

    ${lead.whatsapp ? `
    <div class="field">
      <div class="field-label">💬 WhatsApp</div>
      <div class="field-value"><a href="https://wa.me/${lead.whatsapp?.replace(/[^0-9]/g, '')}">${lead.whatsapp}</a></div>
    </div>
    ` : ''}

    ${lead.email ? `
    <div class="field">
      <div class="field-label">📧 Email</div>
      <div class="field-value"><a href="mailto:${lead.email}">${lead.email}</a></div>
    </div>
    ` : ''}

    ${lead.equipmentType ? `
    <div class="field">
      <div class="field-label">🚜 Тип техники</div>
      <div class="field-value">${lead.equipmentType}</div>
    </div>
    ` : ''}

    ${lead.component ? `
    <div class="field">
      <div class="field-label">🔧 Узел/Компонент</div>
      <div class="field-value">${lead.component}</div>
    </div>
    ` : ''}

    ${lead.symptoms ? `
    <div class="field">
      <div class="field-label">⚠️ Симптомы/Проблемы</div>
      <div class="field-value">${lead.symptoms}</div>
    </div>
    ` : ''}

    ${lead.comment ? `
    <div class="field">
      <div class="field-label">💬 Комментарий</div>
      <div class="field-value">${lead.comment}</div>
    </div>
    ` : ''}

    <div class="field">
      <div class="field-label">📍 Страница отправки</div>
      <div class="field-value"><a href="${lead.sourcePage}">${lead.sourcePage}</a></div>
    </div>

    <div class="field">
      <div class="field-label">🕐 Время отправки</div>
      <div class="field-value">${lead.createdAt ? new Date(lead.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' }) : '—'}</div>
    </div>

    ${lead.ipAddress ? `
    <div class="field">
      <div class="field-label">🌐 IP адрес</div>
      <div class="field-value">${lead.ipAddress}</div>
    </div>
    ` : ''}
  </div>

  <div class="footer">
    <p>Это автоматическое уведомление с сайта <strong>acahydraulic.kz</strong></p>
    <p>Пожалуйста, свяжитесь с клиентом в течение 15 минут для максимальной конверсии.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send lead notification email
 */
export async function sendLeadEmail(lead: Partial<Lead>): Promise<boolean> {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    const formTypeLabels: Record<string, string> = {
      'b2b': 'B2B Заявка',
      'call_specialist': 'Вызов специалиста',
      'calculator': 'Калькулятор',
    };

    const formTypeLabel = formTypeLabels[lead.formType || ''] || 'Новая заявка';
    const subject = `🔔 ${formTypeLabel} | ${lead.name} | acahydraulic.kz`;

    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'info@acahydraulic.kz';
    const ccEmail = process.env.NOTIFICATION_CC || 'stas@acahydraulic.kz';

    const mailOptions = {
      from: `"ACA Hydraulic Website" <${fromEmail}>`,
      to: notificationEmail,
      cc: ccEmail,
      subject,
      html: generateLeadEmailHTML(lead),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Lead notification sent:', info.messageId);
    
    // Log to file
    logEmailEvent('success', `Notification sent to ${notificationEmail}, CC: ${ccEmail}`, info.messageId);
    
    return true;
  } catch (error) {
    console.error('[Email] Failed to send lead notification:', error);
    logEmailEvent('error', `Failed to send notification: ${error}`);
    return false;
  }
}

/**
 * Generate auto-reply HTML template for client
 */
function generateAutoReplyHTML(lead: Partial<Lead>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      color: #FFB800;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .highlight {
      background: #fff3cd;
      border-left: 4px solid #FFB800;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .contact-info {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    .contact-info a {
      color: #FFB800;
      text-decoration: none;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Ваша заявка принята</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px;">ACA Hydraulic</p>
  </div>
  
  <div class="content">
    <p>Здравствуйте, <strong>${lead.name}</strong>!</p>
    
    <p>Ваша заявка успешно получена и передана нашим специалистам.</p>
    
    <div class="highlight">
      <strong>⏱️ Среднее время ответа: 15–30 минут</strong>
    </div>
    
    <p>Мы свяжемся с вами в ближайшее время для уточнения деталей и согласования выезда специалиста.</p>
    
    <div class="contact-info">
      <p><strong>📞 Срочные случаи?</strong></p>
      <p>Звоните напрямую: <a href="tel:+77714177925">+7 771 417 79 25</a></p>
      <p>WhatsApp: <a href="https://wa.me/77714177925">+7 771 417 79 25</a></p>
    </div>
    
    <p>С уважением,<br>
    <strong>Команда ACA Hydraulic</strong><br>
    Профессиональный ремонт гидравлики спецтехники</p>
  </div>
  
  <div class="footer">
    <p>acahydraulic.kz | info@acahydraulic.kz</p>
    <p>Астана, Абая 24/1</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send auto-reply email to client
 */
export async function sendAutoReply(lead: Partial<Lead>): Promise<boolean> {
  // Only send auto-reply if client provided email
  if (!lead.email) {
    console.log('[Email] No client email provided, skipping auto-reply');
    return true;
  }

  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    const mailOptions = {
      from: `"ACA Hydraulic" <${fromEmail}>`,
      to: lead.email,
      subject: 'Ваша заявка принята | ACA Hydraulic',
      html: generateAutoReplyHTML(lead),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Auto-reply sent:', info.messageId);
    logEmailEvent('success', `Auto-reply sent to ${lead.email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send auto-reply:', error);
    logEmailEvent('error', `Failed to send auto-reply to ${lead.email}: ${error}`);
    return false;
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('[Email] SMTP configuration is valid');
    logEmailEvent('success', 'SMTP configuration verified');
    return true;
  } catch (error) {
    console.error('[Email] SMTP configuration test failed:', error);
    logEmailEvent('error', `SMTP verification failed: ${error}`);
    return false;
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'info@acahydraulic.kz';

    const mailOptions = {
      from: `"ACA Hydraulic Test" <${fromEmail}>`,
      to: notificationEmail,
      subject: 'TEST SMTP ACA Hydraulic',
      html: `
        <h1>✅ SMTP Test Successful</h1>
        <p>This is a test email from ACA Hydraulic website.</p>
        <p>SMTP configuration is working correctly.</p>
        <p>Time: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Test email sent:', info.messageId);
    logEmailEvent('success', `Test email sent to ${notificationEmail}`, info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send test email:', error);
    logEmailEvent('error', `Test email failed: ${error}`);
    return false;
  }
}
