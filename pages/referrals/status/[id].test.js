import { enableFetchMocks } from 'jest-fetch-mock';
import ReferralHistory from 'pages/referrals/status/[id]';

describe('ReferralHistory', () => {
  const expectedResponse = {
    id: '1',
    firstName: 'Wayne',
    lastName: 'Rooney',
    vulnerabilities: [],
    assets: [],
    linkId: 'abc123',
    notes: ''
  };

  beforeEach(() => {
    enableFetchMocks();
    fetch.mockResponse(JSON.stringify(expectedResponse));
  });

  it('fetches referral from the correct url and sets props', async () => {
    const props = await ReferralHistory.getInitialProps({
      query: { id: 'abc123' },
      req: { headers: {} }
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/referrals/status/abc123'),
      expect.any(Object)
    );
    expect(props.referral.id).toStrictEqual('1');
  });
});
