import { findReferrals } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import jsonwebtoken from 'jsonwebtoken';
import Head from 'next/head';
import ReferralsTable from 'components/Feature/ReferralsTable';
const Index = ({ errors, referrerInfo, myReferrals }) => {
  return (
    <>
      <Head>
        <title>Better Conversations: My view</title>
      </Head>
      <h1 className="govuk-heading-l">My referrals</h1>
      <hr className={`govuk-section-break govuk-section-break--m govuk-section-break--visible`} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <ul class="govuk-list">
            <li>
              <a href="#">Team view</a>
            </li>
            <li>
              <a href={`${process.env.NEXT_PUBLIC_URL}/my-view`} style={{ fontWeight: 800 }}>
                My view
              </a>
            </li>
            <li>
              <a href="#">Incoming referrals</a>
            </li>
            <li>
              <a href={process.env.NEXT_PUBLIC_URL}>Better conversations</a>
            </li>
          </ul>
        </div>

        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-m">Historic referrals</h2>
          <ReferralsTable referrals={myReferrals} />
        </div>
      </div>
    </>
  );
};

Index.getInitialProps = async ({ req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);

    const referrerInfo = jsonwebtoken.decode(token);

    let myReferrals = { referrals: [] };
    if (referrerInfo?.email) {
      myReferrals = await findReferrals('referrerEmail', { token });
    }
    const errors = myReferrals?.error;
    return {
      myReferrals: myReferrals.referrals,
      errors,
      referrerInfo
    };
  } catch (err) {
    console.log('Failed to load initial Props:' + err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
