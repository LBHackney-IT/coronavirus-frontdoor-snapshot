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
      // arrange
      const referral = {
        referenceNumber: '8CXU5-',
        resident: {
          firstName: 'John',
          lastName: 'Wick',
          address: '5B Amhurst Road, London',
          postcode: 'E8 1LL',
          phone: '07582999124',
          email: 'john.wick@mailinator.com'
        }
      };

      // act
      const { getByText } = render(<ReferralSummary referral={referral} />);

      // assert
      expect(
        getByText(`Referral for ${referral.resident.firstName} ${referral.resident.lastName}`)
      ).toBeInTheDocument();

      expect(getByText(referral.resident.phone)).toBeInTheDocument();
      expect(getByText(referral.resident.email)).toBeInTheDocument();

      expect(getByText('5B Amhurst Road', { exact: false })).toBeInTheDocument();
      expect(getByText('London', { exact: false })).toBeInTheDocument();
      expect(getByText(referral.resident.postcode, { exact: false })).toBeInTheDocument();
    });

    it('Shows ALL referral details fields', () => {
      // arrange
      const referral = {
        referralReason: 'Desperately needs any vacuuming service for shedded cat fur.',
        conversationNotes: "Resident says: 'fur in the air, fur in the lungs, fur in the pie...'.",
        statusHistory: [
          {
            date: '2021-07-20T09:17:23.305Z',
            status: 'SENT'
          },
          {
            date: '2021-07-22T09:17:23.305Z',
            comment: 'comment',
            status: 'REJECTED'
          }
        ]
      };

      // act
      const { getByText } = render(<ReferralSummary referral={referral} />);

      // assert
      expect(getByText(referral.referralReason)).toBeInTheDocument();
      expect(getByText(referral.conversationNotes)).toBeInTheDocument();
      expect(getByText('Rejected')).toBeInTheDocument();
    });

    it('Shows ALL service details fields', () => {
      // arrange
      const referral = {
        service: {
          name: 'San Techninis Vamzdis',
          contactPhone: '02022159138',
          contactEmail: 'santechninis.vamzdis@vamzsaulis.com',
          address: '15 Markmanor Ave, OtherCouncil, E17 8HJ'
        }
      };

      // act
      const { getByText } = render(<ReferralSummary referral={referral} />);

      // assert
      expect(getByText(`To ${referral.service.name}`)).toBeInTheDocument();
      expect(getByText(referral.service.contactPhone)).toBeInTheDocument();
      expect(getByText(referral.service.contactEmail)).toBeInTheDocument();

      expect(getByText('15 Markmanor Ave', { exact: false })).toBeInTheDocument();
      expect(getByText('OtherCouncil', { exact: false })).toBeInTheDocument();
      expect(getByText('E17 8HJ', { exact: false })).toBeInTheDocument();
    });
  });
});
