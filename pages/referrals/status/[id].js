import { useState, useEffect } from 'react';
import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';

const StatusHistory = ({ referral }) => {
  return <div>{JSON.stringify(referral)}</div>;
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
