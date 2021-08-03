import { findReferrals } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import jsonwebtoken from 'jsonwebtoken';
import Head from 'next/head';
import { convertIsoDateToString } from 'lib/utils/date';
import css from './index.module.scss';
const Index = ({ errors, referrerInfo, myReferrals }) => {
  const statuses = {
    REJECTED: {
      label: 'Rejected',
      class: 'rejected'
    },
    SENT: {
      label: 'In Progress',
      class: 'sent'
    },
    REJECTED: {
      label: 'Approved',
      class: 'approved'
    }
  };

  const getStatus = history => {
    return history.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })[0].status;
  };
  return (
    <>
      <Head>
        <title>Better Conversations: My view</title>
      </Head>
      <h1 className="govuk-heading-l">My referrals</h1>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <ul class="govuk-list">
            <li>
              <a href="#">Team view</a>
            </li>
            <li>
              <a href="#">My view</a>
            </li>
            <li>
              <a href="#">Incoming referrals</a>
            </li>
            <li>
              <a href="#">Better conversations</a>
            </li>
          </ul>
        </div>

        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-m">Historic referrals</h2>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">
                  Reference number
                </th>
                <th scope="col" className="govuk-table__header">
                  Person referred
                </th>
                <th scope="col" className="govuk-table__header">
                  Org referred to
                </th>
                <th scope="col" className="govuk-table__header">
                  Date
                </th>
                <th scope="col" className="govuk-table__header">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {myReferrals.map((referral, index) => {
                return (
                  <tr className="govuk-table__row" key={`referrals-table_row-${index}`}>
                    <td className="govuk-table__cell">
                      <a href="#">{referral.referenceNumber}</a>
                    </td>
                    <td className="govuk-table__cell">
                      {referral.resident.firstName} {referral.resident.lastName}
                    </td>
                    <td className="govuk-table__cell ">{referral.service.name}</td>
                    <td className="govuk-table__cell ">
                      {convertIsoDateToString(new Date(referral.created))}
                    </td>
                    <td className={`govuk-table__cell`}>
                      <span className={`${css[statuses[getStatus(referral.statusHistory)].class]}`}>
                        {statuses[getStatus(referral.statusHistory)].label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

Index.getInitialProps = async ({ req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);

    const referrerInfo = jsonwebtoken.decode(token);

    let myReferrals = [];
    if (referrerInfo.email) {
      myReferrals = await findReferrals({ referrerEmail: referrerInfo.email, token }).referrals;
    }
    const errors = myReferrals.error;
    return {
      myReferrals,
      errors,
      referrerInfo
    };
  } catch (err) {
    console.log('Failed to load initial Props:' + err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
