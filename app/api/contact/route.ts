import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp", ".txt", ".doc", ".docx"]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

function hasSignature(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function isLikelyText(bytes: Uint8Array) {
  const sample = bytes.slice(0, 512);
  return sample.every((byte) => byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126));
}

function isAllowedFile(file: File, bytes: Uint8Array) {
  const extension = getFileExtension(file.name);

  if (
    file.size === 0 ||
    file.size > MAX_ATTACHMENT_SIZE ||
    !ALLOWED_ATTACHMENT_TYPES.has(file.type) ||
    !ALLOWED_ATTACHMENT_EXTENSIONS.has(extension)
  ) {
    return false;
  }

  if (file.type === "application/pdf") {
    return extension === ".pdf" && hasSignature(bytes, [0x25, 0x50, 0x44, 0x46]);
  }

  if (file.type === "image/jpeg") {
    return [".jpg", ".jpeg"].includes(extension) && hasSignature(bytes, [0xff, 0xd8, 0xff]);
  }

  if (file.type === "image/png") {
    return extension === ".png" && hasSignature(bytes, [0x89, 0x50, 0x4e, 0x47]);
  }

  if (file.type === "image/webp") {
    return extension === ".webp" && hasSignature(bytes, [0x52, 0x49, 0x46, 0x46]) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }

  if (file.type === "text/plain") {
    return extension === ".txt" && isLikelyText(bytes);
  }

  if (file.type === "application/msword") {
    return extension === ".doc" && hasSignature(bytes, [0xd0, 0xcf, 0x11, 0xe0]);
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return extension === ".docx" && hasSignature(bytes, [0x50, 0x4b, 0x03, 0x04]);
  }

  return false;
}

function buildEmailHtml({
  name,
  email,
  subject,
  message,
  attachmentCount,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachmentCount: number;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return `
    <div style="margin:0;padding:28px 0;background:#f4f7f8;font-family:Arial,Helvetica,sans-serif;color:#172026;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td align="center" style="padding:0 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #dbe7e8;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:22px 24px;background:#172026;color:#ffffff;border-bottom:4px solid #81E6D9;">
                  <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#81E6D9;font-weight:700;">Portfolio Message</p>
                  <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;">samssiams</h1>
                  <p style="margin:8px 0 0 0;font-size:14px;line-height:1.5;color:#c9d4d6;">New inquiry from ${safeName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:0 0 14px 0;">
                        <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.8px;text-transform:uppercase;color:#718084;font-weight:700;">Name</p>
                        <p style="margin:0;font-size:15px;line-height:1.5;color:#172026;">${safeName}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 14px 0;">
                        <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.8px;text-transform:uppercase;color:#718084;font-weight:700;">Email</p>
                        <p style="margin:0;font-size:15px;line-height:1.5;"><a href="mailto:${safeEmail}" style="color:#0f8f86;text-decoration:none;font-weight:700;">${safeEmail}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 18px 0;">
                        <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.8px;text-transform:uppercase;color:#718084;font-weight:700;">Subject</p>
                        <p style="margin:0;font-size:15px;line-height:1.5;color:#172026;">${safeSubject}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:18px 18px;background:#f6fbfb;border:1px solid #dceced;border-radius:12px;">
                        <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.8px;text-transform:uppercase;color:#0f8f86;font-weight:700;">Message</p>
                        <p style="margin:0;font-size:15px;line-height:1.7;color:#263237;">${safeMessage}</p>
                      </td>
                    </tr>
                    ${
                      attachmentCount > 0
                        ? `<tr>
                            <td style="padding:18px 0 0 0;">
                              <p style="margin:0;font-size:13px;line-height:1.5;color:#718084;">${attachmentCount} attachment${attachmentCount > 1 ? "s" : ""} included below.</p>
                            </td>
                          </tr>`
                        : ""
                    }
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;background:#f8fbfb;border-top:1px solid #e2ecec;">
                  <p style="margin:0;font-size:12px;line-height:1.5;color:#7b8b8f;">Sent from samssiams portfolio contact form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    let name = "";
    let email = "";
    let subject = "";
    let message = "";
    const attachments: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }> = [];

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name")?.toString() || "";
      email = formData.get("email")?.toString() || "";
      subject = formData.get("subject")?.toString() || "";
      message = formData.get("message")?.toString() || "";

      const uploadedFiles = formData
        .getAll("attachments")
        .filter((value): value is File => value instanceof File && value.size > 0);

      for (const file of uploadedFiles) {
        const bytes = new Uint8Array(await file.arrayBuffer());

        if (!isAllowedFile(file, bytes)) {
          return new Response(
            JSON.stringify({ success: false, error: "Attachment rejected. Only real PDF, image, text, or Word files up to 5 MB are allowed." }),
            { status: 400 }
          );
        }

        attachments.push({
          filename: file.name,
          content: Buffer.from(bytes),
          contentType: file.type || "application/octet-stream",
        });
      }
    } else {
      const body = await req.json();
      name = body.name || "";
      email = body.email || "";
      subject = body.subject || "";
      message = body.message || "";
    }

    console.log("Incoming request data:", {
      name,
      email,
      subject,
      message,
      attachments: attachments.map((file) => file.filename),
    });

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpTo = process.env.SMTP_TO;
    const missingConfig = [
      !smtpUser && "SMTP_USER",
      !smtpPass && "SMTP_PASS",
      !smtpTo && "SMTP_TO",
    ].filter(Boolean);

    if (missingConfig.length > 0) {
      console.error("SMTP configuration is missing.", {
        hasUser: Boolean(smtpUser),
        hasPass: Boolean(smtpPass),
        hasTo: Boolean(smtpTo),
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: `Email service is not configured. Missing: ${missingConfig.join(", ")}.`,
        }),
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true if 465, false if 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    console.log("Transporter config:", {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      to: smtpTo,
    });

    const mailOptions = {
      from: `"${name}" <${smtpUser}>`, // Gmail requires sender to be your account
      replyTo: email,
      to: smtpTo,
      subject: `New message from ${name}: ${subject}`,
      text: message,
      attachments,
      html: buildEmailHtml({
        name,
        email,
        subject,
        message,
        attachmentCount: attachments.length,
      }),
    };

    console.log("Mail options prepared:", {
      ...mailOptions,
      attachments: attachments.map((file) => file.filename),
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    return new Response(JSON.stringify({ success: true, info }), { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Email failed" }),
      { status: 500 }
    );
  }
}
