import { requestReferral } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import Head from 'next/head';
import { SummaryList } from 'components/Form';
import { getRecentStatus, parseAddress } from 'lib/utils/referralHelper';
import scss from 'styles/referralStatus.module.scss';
import styles from './index.module.scss';
import { STATUS_MAPPINGS } from 'lib/utils/constants';

const ReferralSummary = ({ referral }) => {
  const recentStatus = getRecentStatus(referral.statusHistory);
  const recentStatusClass = STATUS_MAPPINGS[recentStatus.status]?.class;

  const residentDetails = {
    'Ref ID': referral.referenceNumber,
    'First name': referral.resident?.firstName,
    'Last name': referral.resident?.lastName,
    'Telephone number': referral.resident?.phone,
    'Email address': referral.resident?.email,
    Address: (
      <pre className="govuk-!-margin-top-0">
        {parseAddress(referral.resident?.address, referral.resident?.postcode)}
      </pre>
    )
  };

  const referralDetails = {
    'Reason for referral': referral.referralReason,
    'Reason for rejection': recentStatus.comment || 'N/A',
    'Notes on wider conversation': referral.conversationNotes
  };

  const organisationDetails = {
    'Org referred to': referral.service?.name,
    'Telephone number': referral.service?.contactPhone,
    'Email address': referral.service?.contactEmail,
    Address: <pre className="govuk-!-margin-top-0">{parseAddress(referral.service?.address)}</pre>
  };

  return (
    <>
      <Head>
        <title>Better Conversations: View referral</title>
      </Head>

      <a
        className="govuk-!-margin-bottom-0 govuk-!-margin-top-0 govuk-back-link"
        href={`${process.env.NEXT_PUBLIC_URL}/my-view`}
        data-testid="back-button">
        Back
      </a>
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
        {referral.error ? (
          <h1 className="govuk-heading-l">{referral.error}</h1>
        ) : (
          <div className="govuk-grid-column-three-quarters">
            <h1 className="govuk-heading-l" data-testid="individual-referral-header">
              Referral for {referral.resident?.firstName} {referral.resident?.lastName}
            </h1>
            <div className="govuk-hint" data-testid="individual-referral-hint">
              To {referral.service?.name} &nbsp;
              <span className={`${scss[recentStatusClass]}`}>
                {STATUS_MAPPINGS[recentStatus.status]?.label}
              </span>
            </div>
            <h2 className="govuk-heading-m">Resident details</h2>
            <SummaryList
              name="resident-details"
              entries={residentDetails}
              customStyle={`govuk-!-padding-bottom-8 ${styles['referral-summary-list']}`}
              data-testid="resident-details-summary-list"
            />

            <h2 className="govuk-heading-m">Referral details</h2>
            <SummaryList
              name="referral-details"
              entries={referralDetails}
              customStyle={`govuk-!-padding-bottom-8 ${styles['referral-summary-list']}`}
              data-testid="referral-details-summary-list"
            />

            <h2 className="govuk-heading-m">Organisation details</h2>
            <SummaryList
              name="organisation-details"
              entries={organisationDetails}
              customStyle={`govuk-!-padding-bottom-8 ${styles['referral-summary-list']}`}
              data-testid="organisation-details-summary-list"
            />
          </div>
        )}
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
