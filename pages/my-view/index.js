import { findReferrals } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import jsonwebtoken from 'jsonwebtoken';
import Head from 'next/head';
import ReferralsTable from 'components/Feature/ReferralsTable';
import OverviewBox from 'components/Feature/OverviewBox';
import { getRecentStatus } from 'lib/utils/referralHelper';

const Index = ({ errors, referrerInfo, myReferrals }) => {
  const counts = {};

  for (const status of myReferrals.map(x => getRecentStatus(x.statusHistory).status)) {
    counts[status] = counts[status] ? counts[status] + 1 : 1;
  }
  return (
    <>
      <Head>
        <title>Better Conversations: My view</title>
      </Head>
      <h1 className="govuk-heading-l">My referrals</h1>
      <hr className={`govuk-section-break govuk-section-break--m govuk-section-break--visible`} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <ul className="govuk-list">
            {false && (
              <li>
                <a href="#">Team view</a>
              </li>
            )}
            <li>
              <a href={`${process.env.NEXT_PUBLIC_URL}/my-view`} style={{ fontWeight: 800 }}>
                My view
              </a>
            </li>
            {false && (
              <li>
                <a href="#">Incoming referrals</a>
              </li>
            )}
            <li>
              <a href={process.env.NEXT_PUBLIC_URL}>Better conversations</a>
            </li>
          </ul>
        </div>

        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-m">At a glance</h2>
          <div className="govuk-grid-row">
            <OverviewBox number={myReferrals.length} label="Referrals made" id="referralsMade" />
            <OverviewBox
              number={counts['SENT'] || `0`}
              label="Referrals pending"
              id="referralsPending"
            />
            <OverviewBox
              number={counts['REJECTED'] || `0`}
              label="Referrals rejected"
              id="referralsRejected"
            />
          </div>
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
