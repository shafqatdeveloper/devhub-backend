import mjml2html from "mjml";

export function resetPasswordHTML({ name = "there", resetUrl }) {
  const mjml = `
<mjml>
  <mj-head>
    <mj-preview>Reset your Developers Hub password</mj-preview>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
    <mj-breakpoint width="480px" />
    <mj-attributes>
      <mj-all font-family="Inter, Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" line-height="1.6" color="#1f2937" />
      <mj-button background-color="#111827" color="#ffffff" border-radius="12px" padding="18px 24px" font-size="16px" />
    </mj-attributes>
    <mj-attributes>
      <mj-class name="card" background-color="#ffffff" />
      <mj-class name="muted" color="#6b7280" font-size="12px" />
      <mj-class name="h1" font-size="22px" font-weight="700" color="#111827" />
      <mj-class name="wrap" padding="28px" />
    </mj-attributes>
    <mj-style>
      .brand-badge {
        background: linear-gradient(135deg,#6EE7B7,#3B82F6);
        color:#0b1020;
        font-weight:700;
        letter-spacing:0.5px;
        padding:6px 12px;
        border-radius:999px;
        display:inline-block;
      }
      .btn-block { width:100%; display:inline-block; }
      .card { border-radius:16px; }
      @media only screen and (max-width:480px) {
        .wrap  { padding:16px !important; }
        .h1    { font-size:18px !important; }
        .btn-block { width:100% !important; display:block !important; }
      }
      @media only screen and (min-width:768px) {
        .h1    { font-size:24px !important; }
        .wrap  { padding:36px !important; }
      }
      @media only screen and (min-width:1200px) {
        .h1    { font-size:26px !important; }
        .wrap  { padding:40px !important; }
      }
      @media (prefers-color-scheme: dark) {
        .card  { background:#0f1115 !important; }
        .muted { color:#9CA3AF !important; }
        .h1    { color:#F3F4F6 !important; }
      }
    </mj-style>
  </mj-head>

  <mj-body width="720px" background-color="#F3F4F6">
    <mj-section padding="24px 0">
      <mj-column>
        <mj-text align="center"><span class="brand-badge">Developers Hub</span></mj-text>
      </mj-column>
    </mj-section>

    <mj-section css-class="card" padding="0">
      <mj-column css-class="wrap">
        <mj-text mj-class="h1">Reset your password</mj-text>
        <mj-spacer height="6px" />
        <mj-text>Hello ${name},</mj-text>
        <mj-text>
          We received a request to reset your <strong>Developers Hub</strong> password.
          Click the button below to set a new one.
        </mj-text>
        <mj-button href="${resetUrl}" css-class="btn-block">Create New Password</mj-button>
        <mj-text mj-class="muted">
          Or copy & paste this link in your browser:<br/>
          <span style="word-break:break-all;color:#111827;">${resetUrl}</span>
        </mj-text>
      </mj-column>
      <mj-divider border-color="#E5E7EB" />
      <mj-column css-class="wrap" padding-top="0">
        <mj-text mj-class="muted">
          This link expires in <strong>60 minutes</strong>. If you didn’t request a password reset, you can safely ignore this email.
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="8px 0 24px">
      <mj-column>
        <mj-text align="center" color="#9CA3AF" font-size="12px">
          © ${new Date().getFullYear()} Developers Hub — All rights reserved.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;
  return mjml2html(mjml, { validationLevel: "soft" }).html;
}
