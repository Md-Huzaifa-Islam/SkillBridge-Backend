export const verifyHtmlGenerate = (verificationUrl: string) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Verify Your Email</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <h1 style="margin:0;color:#2563eb;font-size:28px;font-weight:700;">
                        Skill Bridge
                      </h1>
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td align="center" style="padding-bottom:10px;">
                      <h2 style="margin:0;color:#111827;font-size:22px;">
                        Verify your email address
                      </h2>
                    </td>
                  </tr>

                  <!-- Text -->
                  <tr>
                    <td align="center" style="padding:10px 0 30px 0;color:#6b7280;font-size:15px;line-height:1.6;">
                      Thanks for joining <strong>Skill Bridge</strong>.  
                      Please confirm your email address by clicking the button below.
                    </td>
                  </tr>

                  <!-- Button -->
                  <tr>
                    <td align="center" style="padding-bottom:30px;">
                      <a href="${verificationUrl}"
                        style="
                          display:inline-block;
                          background:#2563eb;
                          color:#ffffff;
                          padding:14px 28px;
                          font-size:16px;
                          font-weight:600;
                          text-decoration:none;
                          border-radius:8px;
                          box-shadow:0 6px 14px rgba(37,99,235,0.35);
                        ">
                        Verify Email
                      </a>
                    </td>
                  </tr>

                  <!-- Fallback -->
                  <tr>
                    <td style="color:#9ca3af;font-size:13px;line-height:1.5;text-align:center;">
                      If the button doesn't work, copy and paste this link into your browser:<br/>
                      <span style="color:#2563eb;word-break:break-all;">
                        ${verificationUrl}
                      </span>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top:30px;color:#9ca3af;font-size:12px;">
                      © ${new Date().getFullYear()} Skill Bridge. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
    `;
};
