import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json(); // ✅ now includes subject

    console.log("📩 Incoming request data:", { name, email, subject, message });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true if 465, false if 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("🔑 Transporter config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      to: process.env.SMTP_TO,
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // Gmail requires sender to be your account
      replyTo: email,
      to: process.env.SMTP_TO,
      subject: `New message from ${name}: ${subject}`,
      text: message,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    console.log("✉️ Mail options prepared:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info);

    return new Response(JSON.stringify({ success: true, info }), { status: 200 });
  } catch (err) {
    console.error("❌ Email error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Email failed" }),
      { status: 500 }
    );
  }
}
