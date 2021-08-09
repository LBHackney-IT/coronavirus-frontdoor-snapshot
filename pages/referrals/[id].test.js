import { enableFetchMocks } from 'jest-fetch-mock';
import { render } from '@testing-library/react';
import ReferralSummary from 'pages/referrals/[id]';

describe('ReferralSummary', () => {
  const expectedResponse = {
    id: '1',
    firstName: 'Wayne',
    lastName: 'Rooney'
  };

  beforeEach(() => {
    enableFetchMocks();
    fetch.mockResponse(JSON.stringify(expectedResponse));
  });

  describe('Get initial props', () => {
    it('fetches referral from the correct url and sets props', async () => {
      const props = await ReferralSummary.getInitialProps({
        query: { id: '1' },
        req: { headers: {} }
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/referrals/1'),
        expect.any(Object)
      );
      expect(props.referral).toStrictEqual(expectedResponse);
    });
  });

  describe('Referral page', () => {
    it('Shows ALL resident fields', () => {
      const referral = {
        referenceNumber: '8CXU5-',
        resident: {
          firstName: 'John',
          lastName: 'Wick',
          address: '5B Amhurst Road, Hackney',
          postcode: 'E81LL',
          phone: '07582999124',
          email: 'john.wick@mailinator.com'
        }
      };
      const { getByText } = render(<ReferralSummary referral={referral} />);
      // Name in the title
      expect(
        getByText(`Referral for ${referral.resident.firstName} ${referral.resident.lastName}`)
      ).toBeInTheDocument();

      expect(getByText(`${referral.resident.phone}`)).toBeInTheDocument();
      expect(getByText(`${referral.resident.email}`)).toBeInTheDocument();
      expect(getByText('5B Amhurst Road', { exact: false })).toBeInTheDocument();
      expect(getByText('Hackney', { exact: false })).toBeInTheDocument();
      expect(getByText(`${referral.resident.postcode}`)).toBeInTheDocument();
    });
  });
});
