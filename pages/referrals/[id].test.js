import { enableFetchMocks } from 'jest-fetch-mock';
import { render } from '@testing-library/react';
import ReferralSummary from 'pages/referrals/[id]';

describe('ReferralSummary', () => {
  const resources = [];

  const expectedResponse = {
    id: '1',
    firstName: 'Wayne',
    lastName: 'Rooney',
    vulnerabilities: [],
    assets: [],
    notes: ''
  };

  beforeEach(() => {
    enableFetchMocks();
    fetch.mockResponse(JSON.stringify(expectedResponse));
  });

  it('fetches referral from the correct url and sets props', async () => {
    const props = await ReferralSummary.getInitialProps({
      query: { id: '1' },
      req: { headers: {} }
    });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/referrals/1'), expect.any(Object));
    expect(props.initialReferral).toStrictEqual(expectedResponse);
  });

  describe('adding a referral', () => {
    it('shows the name', () => {
      const referral = {
        firstName: 'John',
        lastName: 'Wick',
        vulnerabilities: [],
        assets: []
      };
      const { getByText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(getByText(`${referral.firstName}'s resources`)).toBeInTheDocument();
    });

    it('shows the dob', () => {
      const d = new Date();
      const referral = {
        dob: d.setFullYear(d.getFullYear() - 45),
        vulnerabilities: [],
        assets: []
      };
      const { getByText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(getByText(/Aged 45/)).toBeInTheDocument();
    });

    it('shows the vulnerabilities grid', () => {
      const referral = {
        vulnerabilities: [],
        assets: []
      };
      const { container } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(container.querySelector('.govuk-accordion')).toBeInTheDocument();
    });

    it('shows the notes', () => {
      const referral = {
        vulnerabilities: [],
        assets: []
      };
      const { getByLabelText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(
        getByLabelText(`What prompted the Resident to get in touch today?`)
      ).toBeInTheDocument();
    });

    it('hides the edit view if a vulnerability exists', () => {
      const referral = {
        vulnerabilities: [{ name: 'v1', data: [] }],
        assets: []
      };
      const { container, getByText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(container.querySelector('.govuk-accordion')).not.toBeInTheDocument();
      expect(getByText('v1')).toBeInTheDocument();
    });

    it('hides the edit view if a asset exists', () => {
      const referral = {
        vulnerabilities: [],
        assets: [{ name: 'a1', data: [] }]
      };
      const { container, getByText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(container.querySelector('.govuk-accordion')).not.toBeInTheDocument();
      expect(getByText('a1')).toBeInTheDocument();
    });

    it('hides the edit view if notes exist', () => {
      const referral = {
        vulnerabilities: [],
        assets: [],
        notes: 'some notes'
      };
      const { container, getByText } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(container.querySelector('.govuk-accordion')).not.toBeInTheDocument();
      expect(getByText('some notes')).toBeInTheDocument();
    });

    it('sends back to Support For Hackney Residents when Back button is clicked', () => {
      const referral = {
        vulnerabilities: [],
        assets: [],
        systemIds: ['wub']
      };
      const { container, getByTestId } = render(
        <ReferralSummary initialReferral={referral} resources={resources} />
      );
      expect(getByTestId('back-link-test')).toHaveAttribute(
        'href',
        'https://inh-admin-test.hackney.gov.uk/help-requests/edit/wub'
      );
    });
  });
});
