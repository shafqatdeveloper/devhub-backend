import mjml2html from "mjml";

export function verifyEmailHTML({ name = "there", verifyUrl }) {
  const mjml = `
<mjml>
  <mj-head>
    <!-- Preheader (appears next to subject in inbox) -->
    <mj-preview>Confirm your email to activate your Developers Hub account</mj-preview>

    <!-- Use Google Font (fallbacks provided) -->
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
    <!-- Set mobile breakpoint -->
    <mj-breakpoint width="480px" />

    <mj-attributes>
      <mj-all font-family="Inter, Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" line-height="1.6" color="#1f2937" />
      <mj-section padding="0px" />
      <mj-column padding="0px" />
      <mj-button background-color="#111827" color="#ffffff" border-radius="12px" padding="18px 24px" font-size="16px" />
    </mj-attributes>

    <!-- Component-level shortcut classes -->
    <mj-attributes>
      <mj-class name="card" background-color="#ffffff" />
      <mj-class name="muted" color="#6b7280" font-size="12px" />
      <mj-class name="h1" font-size="20px" font-weight="700" color="#111827" />
      <mj-class name="wrap" padding="24px" />
    </mj-attributes>

    <!-- Extra responsive & dark-mode friendly CSS -->
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
      @media only screen and (max-width:480px) {
        .wrap       { padding:16px !important; }
        .h1         { font-size:18px !important; }
        .btn-block  { width:100% !important; display:block !important; }
      }
      @media (prefers-color-scheme: dark) {
        .card       { background:#0f1115 !important; }
        .muted      { color:#9CA3AF !important; }
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#F3F4F6">
    <!-- Top badge -->
    <mj-section padding-top="24px" padding-bottom="24px">
      <mj-column>
        <mj-text align="center">
          <span class="brand-badge">Developers Hub</span>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Card -->
    <mj-section css-class="card" border-radius="16px" padding="0">
      <mj-column css-class="wrap">
        <mj-text mj-class="h1">Verify your email</mj-text>
        <mj-spacer height="6px" />
        <mj-text>Hello ${name},</mj-text>
        <mj-text>
          Thanks for signing up to <strong>Developers Hub</strong> — the place where devs share ideas like a social feed.
          Please confirm this email to activate your account.
        </mj-text>

        <!-- Button (full width on mobile) -->
        <mj-button href="${verifyUrl}" css-class="btn-block">Verify Email</mj-button>

        <!-- Fallback link -->
        <mj-text mj-class="muted">
          Or copy & paste this link in your browser:<br/>
          <span style="word-break:break-all;color:#111827;">${verifyUrl}</span>
        </mj-text>
      </mj-column>

      <mj-divider border-color="#E5E7EB" />
      <mj-column css-class="wrap" padding-top="0">
        <mj-text mj-class="muted">
          This link expires in <strong>24 hours</strong>. If you didn’t create this account, you can safely ignore this email.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section padding-top="8px" padding-bottom="24px">
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
