const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendThankYouEmail = async (userEmail, listingTitle) => {
    try {
        const info = await transporter.sendMail({
            from: `"StayWave Team" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🎉 Thank You for Listing on StayWave!",
            text: `Thank you for adding "${listingTitle}" on StayWave! We're excited to have you onboard.

Your listing will soon be visible to guests around the world. Make sure all details are accurate and attractive!

If you have any questions or need help, feel free to reach out to our support team anytime.

Stay awesome,
The StayWave Team`,

            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>🎉 Thanks for listing <em>${listingTitle}</em> on StayWave!</h2>
                    <p>We're thrilled to have you as a host. Your listing is now on its way to reaching travelers across the globe.</p>
                    <ul>
                        <li>📍 Make sure your details are accurate</li>
                        <li>🖼️ Add great photos to attract guests</li>
                        <li>💬 Respond to inquiries quickly for better ratings</li>
                    </ul>
                    <p>If you ever need assistance, our support team is here for you 24/7.</p>
                    <p>Thanks again for choosing StayWave!</p>
                    <p>Warm regards,<br/><strong>The StayWave Team</strong></p>
                </div>
            `,
        });

        console.log("✅ Email sent :", info.messageId);
        console.log("✅ Email sent To :", userEmail);
    }
    
    catch (err) {
        console.error("❌ Email send failed:", err);
    }
};

module.exports = sendThankYouEmail;
