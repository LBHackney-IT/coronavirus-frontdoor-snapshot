import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { REFERRAL_STATUSES } from 'lib/utils/constants';
import useReferral from 'lib/api/utils/useReferral';
import { IsoDateTime } from 'lib/domain/isodate';
import { useState } from 'react';
import StatusForm from 'components/Feature/StatusForm';

const StatusHistory = ({ referral }) => {
  const { updateReferral } = useReferral(null, {});
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
        date: IsoDateTime.now()
      }
    ]);
    const newReferral = {
      id: initialReferral.id,
      statusHistory: newStatusHistory
    };

    await updateReferral(newReferral);
    setSubmitted(true);
  };

  return (
    <div>
      {submitted ? (
        <div>Thank you, your decision on this referral has been sent</div>
      ) : recentStatus.status == REFERRAL_STATUSES.Approved ||
        recentStatus.status == REFERRAL_STATUSES.Rejected ? (
        <div>
          The referral was {recentStatus.status} on {recentStatus.date}
        </div>
      ) : (
        <StatusForm onSubmitForm={onSubmitForm} />
      )}
    </div>
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
