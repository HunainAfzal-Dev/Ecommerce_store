/**
 * Email utility (Nodemailer).
 *
 * Default transporter is Gmail SMTP. Swap SMTP_HOST / SMTP_PORT / SMTP_SECURE
 * later for a custom domain without changing call sites.
 */

const nodemailer = require('nodemailer');

let transporter = null;

const isEmailConfigured = () =>
    Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
    if (transporter) return transporter;
    if (!isEmailConfigured()) return null;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter;
};

const formatPkr = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

const formatDate = (iso) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-PK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const escapeHtml = (value) =>
    String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const buildOrderConfirmationHtml = ({
    customerName,
    trackingCode,
    items,
    totalAmount,
    shippingAddress,
    city,
    phone,
    estimatedDeliveryDate,
    estimatedDeliveryDays,
    frontendUrl
}) => {
    const rows = (items || [])
        .map((item) => {
            const name = escapeHtml(item.name);
            const qty = item.quantity;
            const lineTotal = formatPkr(item.price * item.quantity);
            const unit = formatPkr(item.price);
            return `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${name}</td>
                <td style="padding:10px 8px;border-bottom:1px solid #e7e5e4;font-size:13px;color:#57534e;text-align:center;">${qty}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:13px;color:#57534e;text-align:right;">${unit}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;font-weight:600;">${lineTotal}</td>
              </tr>`;
        })
        .join('');

    const trackUrl = `${(frontendUrl || '').replace(/\/$/, '')}/track?ref=${encodeURIComponent(trackingCode)}`;
    const deliveryCopy =
        estimatedDeliveryDays === 0
            ? 'Your order has been delivered.'
            : `Estimated delivery: ${estimatedDeliveryDays} day${estimatedDeliveryDays === 1 ? '' : 's'} (${formatDate(estimatedDeliveryDate)}).`;

    return `
    <div style="margin:0;padding:24px;background:#faf9f6;font-family:Georgia,'Times New Roman',serif;color:#1c1917;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
        <div style="padding:28px 28px 16px;background:#1c1917;color:#fafaf9;">
          <p style="margin:0;letter-spacing:0.22em;font-size:11px;text-transform:uppercase;color:#d6d3d1;">Garments Store</p>
          <h1 style="margin:10px 0 0;font-size:24px;font-weight:700;">Order confirmed</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:15px;">Dear ${escapeHtml(customerName || 'Customer')},</p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#44403c;">
            Thank you for your order. We have received it and will prepare your garments for dispatch.
            Your tracking reference is below — keep it handy to follow your shipment.
          </p>
          <div style="margin:0 0 24px;padding:16px;background:#faf9f6;border:1px solid #e7e5e4;border-radius:12px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#78716c;">Order Tracking ID</p>
            <p style="margin:8px 0 0;font-size:22px;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;letter-spacing:0.08em;">#${escapeHtml(trackingCode)}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr>
                <th style="text-align:left;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#78716c;padding-bottom:8px;">Item</th>
                <th style="text-align:center;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#78716c;padding-bottom:8px;">Qty</th>
                <th style="text-align:right;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#78716c;padding-bottom:8px;">Price</th>
                <th style="text-align:right;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#78716c;padding-bottom:8px;">Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin:0 0 20px;text-align:right;font-size:16px;font-weight:700;">Total: ${formatPkr(totalAmount)}</p>
          <div style="padding:16px;border-top:1px solid #e7e5e4;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#78716c;">Shipping address</p>
            <p style="margin:0;font-size:14px;line-height:1.5;">${escapeHtml(shippingAddress)}<br/>${escapeHtml(city)}<br/>${escapeHtml(phone)}</p>
          </div>
          <div style="margin-top:16px;padding:16px;background:#f5f5f4;border-radius:12px;">
            <p style="margin:0 0 8px;font-size:14px;"><strong>Payment:</strong> Cash on Delivery (COD). Please keep the exact amount ready at delivery.</p>
            <p style="margin:0;font-size:14px;">${deliveryCopy}</p>
          </div>
          <p style="margin:24px 0 0;text-align:center;">
            <a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">Track your order</a>
          </p>
        </div>
      </div>
    </div>`;
};

const sendMail = async ({ to, subject, html, text }) => {
    const mailer = getTransporter();
    if (!mailer) {
        console.warn('Email skipped: SMTP_USER / SMTP_PASS are not configured.');
        return { skipped: true };
    }

    const from =
        process.env.SMTP_FROM ||
        `Garments Store <${process.env.SMTP_USER}>`;

    await mailer.sendMail({ from, to, subject, html, text });
    return { skipped: false };
};

const sendOrderConfirmationEmail = async (payload) => {
    const trackingCode = payload.trackingCode;
    const subject = `Order confirmed — #${trackingCode} | Garments Store`;
    const html = buildOrderConfirmationHtml(payload);
    const itemLines = (payload.items || [])
        .map(
            (item) =>
                `- ${item.name} × ${item.quantity} @ ${formatPkr(item.price)}`
        )
        .join('\n');

    const text = [
        `Dear ${payload.customerName || 'Customer'},`,
        '',
        `Your order #${trackingCode} has been placed.`,
        itemLines,
        `Total: ${formatPkr(payload.totalAmount)}`,
        `Ship to: ${payload.shippingAddress}, ${payload.city}`,
        'Payment: Cash on Delivery (COD).',
        `Estimated delivery: ${payload.estimatedDeliveryDays} days.`,
        '',
        `Track: ${(payload.frontendUrl || '').replace(/\/$/, '')}/track?ref=${encodeURIComponent(trackingCode)}`
    ].join('\n');

    return sendMail({ to: payload.to, subject, html, text });
};

module.exports = {
    sendMail,
    sendOrderConfirmationEmail,
    isEmailConfigured
};
