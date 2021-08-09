import { requestReferral } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';

const ReferralSummary = ({ initialReferral }) => {
  return <>{JSON.stringify(initialReferral)}</>;
};

ReferralSummary.getInitialProps = async ({ query: { id }, req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialReferral = await requestReferral(id, { token });

    return {
      initialReferral
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default ReferralSummary;
