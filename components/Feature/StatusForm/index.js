import { REFERRAL_STATUSES } from 'lib/utils/constants';

const StatusForm = ({ onSubmitForm }) => (
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
);

export default StatusForm;
