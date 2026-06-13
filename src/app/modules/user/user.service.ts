import prisma from '../../../shared/prisma';
import { RedisService } from '../../../shared/redis';
import { sendEmailHelper } from '../../../utils/sendEmailHelper';
import { aiHelper } from '../../../utils/aiHelper';
import { paymentHelper } from '../../../utils/paymentHelper';

const processComplexUserWorkspace = async (userData: any, fileUrl: string) => {
  const newUserRecord = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      avatarUrl: fileUrl,
    },
  });

  await RedisService.client.set(`user_session:${newUserRecord.id}`, JSON.stringify(newUserRecord), {
    EX: 3600,
  });

  const generatedInsightWelcomeText = await aiHelper.generateAiResponse(
    `Write a short 1-line welcoming phrase for our active premium platform buyer client named ${userData.name}.`
  );

  await sendEmailHelper.sendEmail(
    userData.email,
    'Welcome onboard transaction active record logger notification email setup!',
    `<h1>Welcome!</h1><p>${generatedInsightWelcomeText}</p>`
  );

  const targetPaymentGatewayRedirectAddressUrl = await paymentHelper.initPayment({
    total_amount: 1500,
    tran_id: `TXN-${Date.now()}`,
    cus_name: userData.name,
    cus_email: userData.email,
    cus_phone: '01700000000',
  });

  return {
    user: newUserRecord,
    checkoutUrl: targetPaymentGatewayRedirectAddressUrl,
  };
};

export const UserService = {
  processComplexUserWorkspace,
};
