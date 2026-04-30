/**
 * RoyalRoot Interiors - Email Notification Utility
 * 
 * This service handles all brand communication. Currently configured to simulate
 * delivery for development purposes. 
 * 
 * To move to production:
 * 1. Install 'resend': npm install resend
 * 2. Add RESEND_API_KEY to .env.local
 * 3. Update the sendEmail function below.
 */

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  // SIMULATION LOGIC
  console.log('-------------------------------------------');
  console.log(`[EMAIL DISPATCHED]`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`CONTENT: (HTML Content omitted for brevity)`);
  console.log('-------------------------------------------');

  // In a real implementation:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'RoyalRoot <concierge@royalroot.com>', to, subject, html });

  return { success: true, messageId: Math.random().toString(36).substring(7) };
}

export const emailTemplates = {
  orderConfirmation: (orderId: string, total: number) => ({
    subject: `RoyalRoot Acquisition Confirmed: #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: serif; color: #1a1c1a; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0;">
        <h1 style="font-weight: normal; font-size: 24px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">Acquisition Confirmed.</h1>
        <p>Your journey through architectural excellence has reached a new milestone.</p>
        <p>Order Reference: <strong>#${orderId.slice(0, 8).toUpperCase()}</strong></p>
        <p>Total Investment: <strong>$${total.toLocaleString()}</strong></p>
        <p style="margin-top: 40px; font-style: italic; color: #666;">Our white-glove logistics team is currently preparing your masterpieces for transit.</p>
        <div style="margin-top: 40px; border-top: 1px solid #f0f0f0; pt-20; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
          RoyalRoot Interiors - Architectural Silence.
        </div>
      </div>
    `
  }),
  adminNewOrder: (orderId: string, email: string) => ({
    subject: `[ALERT] New Acquisition Recorded: #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; color: #1a1c1a; padding: 20px;">
        <h2>New Order Received</h2>
        <p>A new acquisition has been recorded in the registry.</p>
        <p>Collector: ${email}</p>
        <p>Reference: ${orderId}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" style="display: inline-block; background: #1a1c1a; color: white; padding: 10px 20px; text-decoration: none; margin-top: 20px;">Review Protocol</a>
      </div>
    `
  }),
  shippingUpdate: (orderId: string, status: string) => ({
    subject: `Protocol Update: #${orderId.slice(0, 8).toUpperCase()} is now ${status.toUpperCase()}`,
    html: `
      <div style="font-family: serif; color: #1a1c1a; padding: 40px;">
        <h1 style="font-weight: normal; font-size: 24px;">Transit Status Updated.</h1>
        <p>Your acquisition status has been updated to: <strong>${status.toUpperCase()}</strong></p>
        <p>Reference: #${orderId.slice(0, 8).toUpperCase()}</p>
        <p style="margin-top: 40px;">Your environment is about to be elevated.</p>
      </div>
    `
  })
};
