import { requestReferral } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import Head from 'next/head';
import { SummaryList } from 'components/Form';

const ReferralSummary = ({ referral }) => {
  const getRecentStatus = history => {
    if (!history) return { status: 'NOT_SET' };
    return history.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })[0];
  };

  const recentStatus = getRecentStatus(referral.statusHistory);

  const residentDetails = {
    'Ref ID': referral.referenceNumber,
    'First name': referral.resident.firstName,
    'Last name': referral.resident.lastName,
    'Telephone number': referral.resident.phone,
    'Email address': referral.resident.email,
    Address: (
      <span>
        {referral.resident.address.split(',').map(addressLine => (
          <>
            {addressLine} <br />
          </>
        ))}{' '}
        {referral.resident.postcode}
      </span>
    )
  };

  const referralDetails = {
    'Reason for referral': referral.referralReason,
    'Reason for rejection': recentStatus.comment || 'N/A',
    'Notes on wider conversation': referral.conversationNotes
  };

  const organisationDetails = {
    'Org referred to': referral.service.name,
    'Telephone number': referral.service.contactPhone,
    'Email address': referral.service.contactEmail,
    Address: (
      <span>
        {referral.service.address.split(',').map(addressLine => (
          <>
            {addressLine} <br />
          </>
        ))}
      </span>
    )
  };

  return (
    <>
      <Head>
        <title>Better Conversations: View referral</title>
      </Head>

      <h1 className="govuk-heading-m">Support for Hackney resident</h1>
      <hr className={`govuk-section-break govuk-section-break--m govuk-section-break--visible`} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <ul className="govuk-list">
            <li>
              <a href={`${process.env.NEXT_PUBLIC_URL}/my-view`}>My view</a>
            </li>
            <li>
              <a href={process.env.NEXT_PUBLIC_URL}>Better conversations</a>
            </li>
          </ul>
        </div>

        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-l">
            Referral for {referral.resident.firstName} {referral.resident.lastName}
          </h2>
          <div className="govuk-hint">
            To {referral.service.name} {recentStatus.status}
          </div>
          <h3 className="govuk-heading-m">Resident details</h3>
          <SummaryList
            name="resident-details"
            entries={residentDetails}
            customStyle="govuk-!-padding-bottom-8"
          />

          <h3 className="govuk-heading-m">Referral details</h3>
          <SummaryList
            name="referral-details"
            entries={referralDetails}
            customStyle="govuk-!-padding-bottom-8"
          />

          <h3 className="govuk-heading-m">Organisation details</h3>
          <SummaryList
            name="organisation-details"
            entries={organisationDetails}
            customStyle="govuk-!-padding-bottom-8"
          />
        </div>
      </div>
    </>
  );
};

ReferralSummary.getInitialProps = async ({ query: { id }, req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const referral = await requestReferral(id, { token });

    return {
      referral
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default ReferralSummary;
