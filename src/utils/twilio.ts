// twilioUtils.js

import * as twilio from 'twilio';
import { UnauthorizedException } from '@nestjs/common';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

export const sendSMS = async (phone: string, text: string) => {
  try {
    const message = await client.messages.create({
      body: text,
      to: phone,
      from: '+351923241570',
    });
    console.log(`SMS успешно отправлено с SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Ошибка отправки SMS:', error.message);
    throw error;
  }
};

export const sendOTP = async (phone: string) => {
  return await client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: 'sms' });
};

export const validateOTP = async (phone: string, otp: string) => {
  const verificationCheck = await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: phone, code: otp });
  if (verificationCheck.status !== 'approved') {
    throw new UnauthorizedException('Invalid OTP');
  }
  return true;
};
