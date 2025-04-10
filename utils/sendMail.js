const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send OTP Email
const sendOtpEmail = async (userEmail, username, otp) => {
  try {
    await transporter.sendMail({
      from: `"StayWave Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🔐 StayWave OTP Verification - Complete Your Signup",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
        
          <!-- 🔔 Top Alert Message -->
          <p style="text-align: center; font-size: 14px; color: #555; margin-bottom: 20px;">
            ⚠️ This OTP is valid only for 1 minute. Do not share it with anyone.
          </p>

          <!-- 📢 Banner -->
          <div style="max-width: 600px; margin: auto;">
            <div style="background-color: #00bfa6; color: white; padding: 12px 20px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 6px 6px 0 0;">
              🛡️ StayWave - Secure Signup Verification
            </div>

            <!-- Email Body -->
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #00bfa6; text-align: center;">Welcome to StayWave 🏖️</h2>
              <p style="font-size: 16px;">Hi <strong>${username}</strong>,</p>
              <p>Thank you for signing up on <strong>StayWave</strong>. To verify your email, please use the OTP below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #00bfa6;">${otp}</span>
              </div>

              <p>This OTP is valid for <strong>1 minute</strong>. Please do not share it with anyone.</p>
              <p>If you did not try to register, you can ignore this email.</p>

              <hr style="margin: 30px 0;">
              <p style="font-size: 14px; color: #999;">Need help? Reach out at support@staywave.com</p>
              <p style="font-size: 14px; color: #999;">Stay awesome,<br><strong>The StayWave Team</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ OTP Email sent to:", userEmail);
  } catch (err) {
    console.error("❌ OTP Email send failed:", err);
  }
};



// ✅ Thank You Email
const sendThankYouEmail = async (userEmail, listingTitle) => {
  try {
    await transporter.sendMail({
      from: `"StayWave Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎉 Thank You for Listing on StayWave!",
      html: `
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600" style="background: #ffffff; padding: 30px; border-radius: 8px; font-family: Arial, sans-serif; color: #333333; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <h2 style="color: #00bfa6; margin: 0;">🎉 Thanks for listing <em>${listingTitle}</em> on StayWave!</h2>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; padding-bottom: 10px;">
                    We're thrilled to have you as a host. Your listing is now on its way to reaching travelers across the globe.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; padding-bottom: 10px;">
                    <ul style="padding-left: 20px; margin: 0;">
                      <li>📍 Make sure your details are accurate</li>
                      <li>🖼️ Add great photos to attract guests</li>
                      <li>💬 Respond to inquiries quickly for better ratings</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; padding-top: 10px;">
                    If you ever need assistance, our support team is here for you 24/7.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; padding-top: 10px;">
                    Thanks again for choosing StayWave!
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; padding-top: 20px;">
                    Warm regards,<br/>
                    <strong>The StayWave Team</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    });

    console.log("✅ Thank You Email sent to:", userEmail);
  } catch (err) {
    console.error("❌ Thank You Email send failed:", err);
  }
};


module.exports = {
  sendOtpEmail,
  sendThankYouEmail,
};
