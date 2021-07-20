import { useState, useEffect } from 'react';
import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { REFERRAL_STATUSES } from 'lib/utils/constants';

const StatusHistory = ({ referral }) => {
  const maxDate = new Date(Math.max(...referral.statusHistory.map(e => new Date(e.date))));
  const recentStatus = referral.statusHistory.filter(status => new Date(status.date) != maxDate)[0];

  return (
    <div>
      {recentStatus.status == REFERRAL_STATUSES.Approved && (
        <div>The referral was approved on {recentStatus.date}</div>
      )}
      {recentStatus.status != REFERRAL_STATUSES.Approved && (
        <div>The status of the referral is {recentStatus.status}</div>
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
