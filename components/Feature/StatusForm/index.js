import { REFERRAL_STATUSES } from 'lib/utils/constants';
import { useState } from 'react';

const StatusForm = ({ onSubmitForm, name }) => {
  const [reject, setReject] = useState(false);
  return (
    <>
      <h1 className="govuk-heading-m">Referral for {name}</h1>
      <form onSubmit={onSubmitForm}>
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <div className="govuk-!-padding-top-4">
              <label>
                <h2 className="govuk-heading-m">Are you able to support this resident?</h2>
              </label>
              <div id="resident-referral-hint" className="govuk-hint">
                Notification will be sent to the relevant team upon your selection
              </div>
            </div>
            <div className="govuk-radios">
              <div className="govuk-radios__item" data-testid="status-form-accepted-radio-item">
                <input
                  className="govuk-radios__input"
                  id="referral-accepted"
                  name="referral-status"
                  type="radio"
                  value={REFERRAL_STATUSES.Accepted}
                  onClick={() => setReject(false)}
                  required
                  data-testid="status-form-accepted-input"
                />
                <label className="govuk-label govuk-radios__label" for="referral-accepted">
                  Yes
                </label>
              </div>
              <div className="govuk-radios__item" data-testid="status-form-rejected-radio-item">
                <input
                  className="govuk-radios__input"
                  id="referral-rejected"
                  name="referral-status"
                  type="radio"
                  value={REFERRAL_STATUSES.Rejected}
                  onClick={() => setReject(true)}
                  required
                  data-testid="status-form-rejected-input"
                />
                <label className="govuk-label govuk-radios__label" for="referral-rejected">
                  No
                </label>
              </div>
              <div
                className={`govuk-radios__conditional ${
                  !reject ? 'govuk-radios__conditional--hidden' : ''
                }`}
                id="conditional-contact"
                data-testid="status-form-rejected-comment">
                <div className="govuk-form-group">
                  <label className="govuk-label" for="referral-rejection-reason">
                    Reason for not accepting this referral (optional)
                  </label>
                  <textarea
                    className="govuk-textarea"
                    id="referral-rejection-reason"
                    name="referral-rejection-reason"
                    spellcheck="false"
                    data-testid="status-form-rejected-comment-input"
                  />
                </div>
              </div>
            </div>
          </fieldset>
          <div className="govuk-!-padding-top-4">
            <input
              value="Submit"
              type="submit"
              id={`submit-referral-status`}
              className="govuk-button"
              name="Submit"
              data-testid="submit-status-form"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default StatusForm;
