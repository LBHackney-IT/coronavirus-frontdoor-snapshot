import { convertIsoDateToString } from 'lib/utils/date';
import css from './index.module.scss';

const ReferralsTable = ({ referrals }) => {
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
        {referrals.map((referral, index) => {
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
  );
};

export default ReferralsTable;
