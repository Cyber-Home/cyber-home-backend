import twilio from "twilio";

export const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const smsService = {
    sendTaskSMS: async (phone, message) => {
        try {
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone
            });
        } catch (error) {
            console.error('SMS sending failed:', error);
        }
    }
};