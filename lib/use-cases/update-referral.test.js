import UpdateReferral from './update-referral';

describe('Update Referral use case', () => {
  it('updates a referral', async () => {
    const referralGateway = { update: jest.fn() };
    const referral = { id: 1, assets: [], vulnerabilities: [], notes: '' };
    const updateReferral = new UpdateReferral({ referralGateway });

    await updateReferral.execute({ referral });

    expect(referralGateway.update).toHaveBeenCalledWith({
      referral
    });
  });
});
