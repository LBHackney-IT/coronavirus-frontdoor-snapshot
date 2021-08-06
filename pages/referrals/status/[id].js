import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { REFERRAL_STATUSES, STATUS_UPDATE } from 'lib/utils/constants';
import useReferral from 'lib/api/utils/useReferral';
import { IsoDateTime } from 'lib/domain/isodate';
import { useState } from 'react';
import StatusForm from 'components/Feature/StatusForm';
import Head from 'next/head';
import { convertIsoDateToDateTimeString } from 'lib/utils/date';
import { sendDataToAnalytics } from 'lib/utils/analytics';
import { encode } from 'html-entities';
import css from './index.module.scss';

const StatusHistory = ({ referral }) => {
  const { updateReferralStatus } = useReferral(null, {});
  const [initialReferral, setInitialReferral] = useState(referral);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(false);

  const maxDate = new Date(Math.max(...referral.statusHistory.map(e => new Date(e.date))));
  const recentStatus = referral.statusHistory.filter(
    status => new Date(status.date).getTime() === maxDate.getTime()
  )[0];

  const onSubmitForm = async (status, comment) => {
    if (!status || status == null || status == '') {
      setErrors(true);
      return;
    }
    setErrors(false);

    const newStatusHistory = initialReferral.statusHistory.concat([
      {
        status,
        date: IsoDateTime.now(),
        comment
      }
    ]);
    const newReferral = {
      ...initialReferral,
      statusHistory: newStatusHistory
    };

    await updateReferralStatus(newReferral);
    setSubmitted(true);

    sendDataToAnalytics({
      action: status,
      category: STATUS_UPDATE,
      label: initialReferral.service.name
    });
  };

  return (
    <>
      <Head>
        <title>Status page</title>
      </Head>
      {errors && (
        <div className={css['error-message']}>
          There was an issue logging your response, please try again.
        </div>
      )}
      {submitted ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div
              className="govuk-panel govuk-panel--confirmation"
              data-testid="status-confirmation-panel">
              <h1 className="govuk-panel__title">Thank you</h1>
              <div className="govuk-panel__body">
                Referral reference number:
                <br /> {referral.referenceNumber}
              </div>
            </div>
            <p>Your decision on this referral has been sent.</p>
            <h2 className="govuk-heading-m">What happens next?</h2>
            <p>We’ve let the referrer know your response.</p>
          </div>
        </div>
      ) : recentStatus.status == REFERRAL_STATUSES.Accepted ||
        recentStatus.status == REFERRAL_STATUSES.Rejected ? (
        <>
          <h1 className="govuk-heading-m" data-testid="status-paragraph">
            This referral was {recentStatus.status} on{' '}
            {convertIsoDateToDateTimeString(new Date(recentStatus.date))}
            {recentStatus.comment && ` with comment: "${encode(recentStatus.comment)}".`}
          </h1>
          <p className="govuk-hint" data-testid="reference-number-paragraph">
            Reference number: {referral.referenceNumber}
          </p>
        </>
      ) : (
        <StatusForm
          onSubmitForm={onSubmitForm}
          name={`${initialReferral.resident.firstName} ${initialReferral.resident.lastName}`}
        />
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
