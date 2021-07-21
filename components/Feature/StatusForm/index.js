import { REFERRAL_STATUSES } from 'lib/utils/constants';
import { useState } from 'react';

const StatusForm = ({ onSubmitForm }) => {
  const [reject, setReject] = useState(false);
  return (
    <form onSubmit={onSubmitForm}>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <div className="govuk-!-padding-top-4">
            <label>
              <span className="govuk-heading-m">Do you acccept this referral?</span>
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
                onClick={() => setReject(false)}
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
                onClick={() => setReject(true)}
                required
              />
              <label className="govuk-label govuk-radios__label" for="referral-rejected">
                No
              </label>
            </div>
            <div
              className={`govuk-radios__conditional ${
                !reject ? 'govuk-radios__conditional--hidden' : ''
              }`}
              id="conditional-contact">
              <div className="govuk-form-group">
                <label className="govuk-label" for="referral-rejection-reason">
                  Reason for not accepting this referral (optional)
                </label>
                <textarea
                  className="govuk-textarea"
                  id="referral-rejection-reason"
                  name="referral-rejection-reason"
                  spellcheck="false"
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
          />
        </div>
      </div>
    </form>
  );
};

export default StatusForm;
