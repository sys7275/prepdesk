import twilio from "twilio";

export async function sendSmsOtp(phone, otp) {
  const provider = (process.env.SMS_PROVIDER || "console").toLowerCase();

  if (provider === "twilio") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Twilio credentials are missing in .env");
    }

    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your PrepDesk verification OTP is ${otp}. Valid for 10 minutes.`,
      from: fromNumber,
      to: phone, // e.g. +917379883936
    });

    return;
  }

  // Fallback for local dev
  console.log(`[PREP-DESK SMS OTP] To ${phone}: ${otp}`);
}