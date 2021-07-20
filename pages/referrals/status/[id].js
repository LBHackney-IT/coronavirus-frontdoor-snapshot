import { requestByLinkId } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { REFERRAL_STATUSES } from 'lib/utils/constants';
import useReferral from 'lib/api/utils/useReferral';
import { IsoDateTime } from 'lib/domain/isodate';

const StatusHistory = ({ referral }) => {
  const { updateReferral } = useReferral(null, {});
  const maxDate = new Date(Math.max(...referral.statusHistory.map(e => new Date(e.date))));
  const recentStatus = referral.statusHistory.filter(status => new Date(status.date) != maxDate)[0];

  const ref = referral; //can't access referral from within onSubmitForm, gotta fix this!

  const onSubmitForm = async e => {
    e.preventDefault();

    const statusHistory = ref.statusHistory.concat([
      {
        status: e.target['referral-status'].value,
        date: IsoDateTime.now()
      }
    ]);
    const referral = {
      id: ref.id, //for some reason it can't get the ID, works if ID is hardcoded
      statusHistory
    };
    const result = await updateReferral(referral);
  };

  return (
    <div>
      {recentStatus.status == REFERRAL_STATUSES.Approved && (
        <div>The referral was approved on {recentStatus.date}</div>
      )}
      {recentStatus.status != REFERRAL_STATUSES.Approved && (
        <form onSubmit={onSubmitForm}>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <div className="govuk-!-padding-top-4">
                <label>
                  <strong>Do you acccept this referral?</strong>
                </label>
                <div id="resident-referral-hint" className="govuk-hint">
                  Notification will be sent to the relevant team upon your selection
                </div>
              </div>
              <div className="govuk-radios">
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="referral-approved"
                    name="referral-status"
                    type="radio"
                    value={REFERRAL_STATUSES.Approved}
                    required
                  />
                  <label className="govuk-label govuk-radios__label" for="referral-approved">
                    Yes
                  </label>
                </div>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="referral-rejected"
                    name="referral-status"
                    type="radio"
                    value={REFERRAL_STATUSES.Rejected}
                    required
                  />
                  <label className="govuk-label govuk-radios__label" for="referral-rejected">
                    No
                  </label>
                </div>
              </div>
            </fieldset>
            <div className="govuk-!-padding-top-2">
              <input
                value="Submit"
                type="submit"
                id={`submit-referral-status`}
                className="govuk-button"
                name="Submit"
              />
            </div>
          </div>
        </form>
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
