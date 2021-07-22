import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { REFERRAL_STATUSES } from 'lib/utils/constants';
import useReferral from 'lib/api/utils/useReferral';
import { IsoDateTime } from 'lib/domain/isodate';
import { useState } from 'react';
import StatusForm from 'components/Feature/StatusForm';
import Head from 'next/head';
import { convertIsoDateToDateTimeString } from 'lib/utils/date';

const StatusHistory = ({ referral }) => {
  const { updateReferralStatus } = useReferral(null, {});
  const [initialReferral, setInitialReferral] = useState(referral);
  const [submitted, setSubmitted] = useState(false);

  const maxDate = new Date(Math.max(...referral.statusHistory.map(e => new Date(e.date))));
  const recentStatus = referral.statusHistory.filter(
    status => new Date(status.date).getTime() === maxDate.getTime()
  )[0];

  const onSubmitForm = async e => {
    e.preventDefault();

    const newStatus = e.target['referral-status'].value;
    const newStatusHistory = initialReferral.statusHistory.concat([
      {
        status: newStatus,
        date: IsoDateTime.now(),
        comment: e.target['referral-rejection-reason'].value
      }
    ]);
    const newReferral = {
      ...initialReferral,
      statusHistory: newStatusHistory
    };

    await updateReferralStatus(newReferral);
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Status page</title>
      </Head>
      {submitted ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div
              className="govuk-panel govuk-panel--confirmation"
              data-testid="status-confirmation-panel">
              <h1 className="govuk-panel__title">Thank you</h1>
              <div className="govuk-panel__body">Your decision on this referral has been sent</div>
            </div>
            <h2 className="govuk-heading-m">What happens next</h2>
            <p>We’ve let the referrer know your response.</p>
          </div>
        </div>
      ) : recentStatus.status == REFERRAL_STATUSES.Accepted ||
        recentStatus.status == REFERRAL_STATUSES.Rejected ? (
        <h1 className="govuk-heading-m" data-testid="status-paragraph">
          This referral was {recentStatus.status} on{' '}
          {convertIsoDateToDateTimeString(new Date(recentStatus.date))}
          {recentStatus.comment && ` with comment: "${recentStatus.comment}".`}
        </h1>
      ) : (
        <StatusForm onSubmitForm={onSubmitForm} />
      )}
    </>
  );
};

StatusHistory.getInitialProps = async ({ query: { id }, req: { headers }, res }) => {
  try {
    const referral = await requestByLinkId(id, { token: undefined });
    return {
      referral
    };
  } catch (err) {
    console.log(err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default StatusHistory;
