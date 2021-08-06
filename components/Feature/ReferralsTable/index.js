import { convertIsoDateToString } from 'lib/utils/date';
import css from './index.module.scss';

const ReferralsTable = ({ referrals }) => {
  const statuses = {
    REJECTED: {
      label: 'Rejected',
      class: 'rejected'
    },
    SENT: {
      label: 'Pending',
      class: 'sent'
    },
    ACCEPTED: {
      label: 'Accepted',
      class: 'accepted'
    },
    NO_STATUS: {
      label: "No status",
      class: "empty"
    }
  };

  const getStatus = history => {
    if (!history) return "NOT_SET";
    return history.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })[0].status;
  };

return (<><p>Displaying {referrals.length} record(s)</p>
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Ref ID
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
            <tr className="govuk-table__row" key={`referrals-table_row-${index}`} data-testid="referrals-table-row">
              <td className="govuk-table__cell" data-testid="referrals-table-recerence-number">
                <a href="#">{referral.referenceNumber || `no ref`}</a>
              </td>
              <td className="govuk-table__cell"  data-testid="referrals-table-resident-name">
                {referral.resident.firstName} {referral.resident.lastName}
              </td>
              <td className="govuk-table__cell " data-testid="referrals-table-service-name">
                {referral.service.name}</td>
              <td className="govuk-table__cell " data-testid="referrals-table-date-created">
                {convertIsoDateToString(new Date(referral.created))}
              </td>
              <td className={`govuk-table__cell`} data-testid="referrals-table-status">
                <div className={`${css[statuses[getStatus(referral.statusHistory)]?.class]}`}>
                  {statuses[getStatus(referral.statusHistory)]?.label || "no status"}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
};

export default ReferralsTable;
