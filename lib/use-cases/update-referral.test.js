import UpdateReferral from './update-referral';

describe('Update Referral use case', () => {
  it('updates a referral', async () => {
    const referralGateway = { save: jest.fn() };
    const referral = { id: 1, assets: [], vulnerabilities: [], notes: '' };
    const updateReferral = new UpdateReferral({ referralGateway });

    await updateReferral.execute({ referral });

    expect(referralGateway.save).toHaveBeenCalledWith({
      referral
    });
  });
});
