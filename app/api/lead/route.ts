import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  colors: {
    primary: string | null;
    trim: string | null;
    accent: string | null;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();
    const { name, email, phone, address, colors } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const leadData = {
      name,
      email,
      phone: phone ?? "",
      address: address ?? "",
      colors,
      source: "SwatchSnap",
      timestamp,
    };

    console.log("[SwatchSnap] New lead:", JSON.stringify(leadData, null, 2));

    // Post to webhook if configured
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim() !== "") {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!webhookRes.ok) {
        console.error(
          "[SwatchSnap] Webhook failed:",
          webhookRes.status,
          await webhookRes.text()
        );
      } else {
        console.log("[SwatchSnap] Lead sent to webhook successfully");
      }
    } else {
      console.log("[SwatchSnap] No LEAD_WEBHOOK_URL configured — lead logged only");
    }

    // Send confirmation email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.trim() !== "") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        const colorSummary = [
          colors.primary ? `Walls: ${colors.primary}` : null,
          colors.trim ? `Trim: ${colors.trim}` : null,
          colors.accent ? `Accents: ${colors.accent}` : null,
        ]
          .filter(Boolean)
          .join(" | ");

        await resend.emails.send({
          from: "SwatchSnap <noreply@swatchsnap.com>",
          to: email,
          subject: "Your SwatchSnap estimate request is confirmed!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f11; color: #ffffff; padding: 40px 32px; border-radius: 12px;">
              <h1 style="color: #f97316; font-size: 28px; margin-bottom: 8px;">You're all set, ${name}!</h1>
              <p style="color: #8b8b97; font-size: 16px; margin-bottom: 24px;">
                Thanks for using SwatchSnap. Our team at <strong style="color: #ffffff;">Northeast Pro Services</strong> will be in touch within 24 hours with your free professional estimate.
              </p>
              ${colorSummary ? `
              <div style="background: #1a1a1f; border: 1px solid #2e2e35; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #8b8b97; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Your Selected Colors</p>
                <p style="color: #ffffff; font-size: 14px; margin: 0;">${colorSummary}</p>
              </div>
              ` : ""}
              <a href="https://northeastproservices.com" style="display: inline-block; background: #f97316; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Visit Northeast Pro Services →
              </a>
              <p style="color: #8b8b97; font-size: 12px; margin-top: 32px;">
                Northeast Pro Services · Buffalo, NY · <a href="https://northeastproservices.com" style="color: #f97316;">northeastproservices.com</a>
              </p>
            </div>
          `,
        });

        console.log("[SwatchSnap] Confirmation email sent to:", email);
      } catch (emailErr) {
        console.error("[SwatchSnap] Email send failed:", emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SwatchSnap] Lead capture error:", err);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
