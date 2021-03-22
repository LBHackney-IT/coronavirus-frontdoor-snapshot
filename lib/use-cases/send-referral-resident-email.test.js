import SendReferralResidentEmail from 'lib/use-cases/send-referral-resident-email';

describe('Send email use case', () => {
  it('sends a referral email', async () => {
    const emailAddress = 'email@email.com';
    const referral = {
      name: 'jon',
      email: 'jon@mail.com',
      referralReason: 'need something',
      referrerName: 'Henry Personson',
      referrerOrganisation: 'Hackney',
      serviceAddress: '12 Real st, E4 9N',
      serviceName: 'Help with things',
      serviceContactPhone: '02045678987',
      serviceContactEmail: 'contact@help.com',
      serviceWebsite: 'www.help.com',
      serviceDescription: 'Good service'
    };
    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };
    process.env.REFERRAL_RESIDENT_EMAIL_TEMPLATE_ID = 'xyz';
    const sendReferralResidentEmail = new SendReferralResidentEmail({
      notifyGateway
    });
    const result = await sendReferralResidentEmail.execute({
      emailAddress,
      referral
    });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith('xyz', emailAddress, {
      name: referral.name,
      referrerName: referral.referrerName,
      referrerOrganisation: referral.referrerOrganisation,
      serviceAddress: referral.serviceAddress,
      serviceName: referral.serviceName,
      serviceDescription: referral.serviceDescription,
      serviceContactPhone: referral.serviceContactPhone,
      serviceWebsite: referral.serviceWebsite
    });
    expect(result).toEqual('email sent');
  });
});
