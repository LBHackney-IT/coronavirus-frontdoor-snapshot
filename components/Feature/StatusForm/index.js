import { REFERRAL_STATUSES } from 'lib/utils/constants';
import { useState } from 'react';

const StatusForm = ({ onSubmitForm, name }) => {
  const [reject, setReject] = useState(false);
  const [status, setStatus] = useState();
  const [comment, setComment] = useState();
  const [validationError, setValidationError] = useState({ rejectReasonHasError: false });

  const onChangeRejectReason = event => {
    const fieldValue = event.target.value;
    const isValueEmpty = !fieldValue;
    setComment(fieldValue);
    setValidationError({ ...validationError, rejectReasonHasError: isValueEmpty });
  };

  return (
    <>
      <h1 className="govuk-heading-m">Referral for {name}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmitForm(
            e.target['referral-status'].value || status,
            e.target['referral-rejection-reason'].value || comment
          );
        }}>
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <div className="govuk-!-padding-top-4">
              <label>
                <h2 className="govuk-heading-m">Are you able to support this resident?</h2>
              </label>
              <div id="resident-referral-hint" className="govuk-hint">
                A notification will be sent to the referrer
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
                  onClick={() => {
                    setStatus(REFERRAL_STATUSES.Accepted);
                    setReject(false);
                  }}
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
                  onClick={() => {
                    setStatus(REFERRAL_STATUSES.Rejected);
                    setReject(true);
                  }}
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
                <div
                  className={`govuk-form-group ${
                    validationError.rejectReasonHasError ? 'govuk-form-group--error' : ''
                  }`}>
                  <div className="govuk-!-padding-bottom-2">
                    <label
                      id="rejection-reason"
                      className="govuk-label"
                      for="referral-rejection-reason">
                      Reason for not accepting this referral (optional)
                    </label>
                    <span id={`reject-comment-error`} className="govuk-error-message">
                      <span
                        hidden={!validationError.rejectReasonHasError}
                        data-testid="reject-comment-error">
                        Please provide a reason for not accepting this referral.
                      </span>
                    </span>
                    <textarea
                      className={`govuk-textarea govuk-!-margin-bottom-0 ${
                        validationError.rejectReasonHasError ? 'govuk-input--error' : ''
                      }`}
                      name="referral-rejection-reason"
                      aria-labelledby="rejection-reason"
                      spellcheck="false"
                      data-testid="status-form-rejected-comment-input"
                      onChange={onChangeRejectReason}
                      required={reject}
                      onInvalid={() =>
                        setValidationError({ ...validationError, rejectReasonHasError: true })
                      }
                    />
                  </div>
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
