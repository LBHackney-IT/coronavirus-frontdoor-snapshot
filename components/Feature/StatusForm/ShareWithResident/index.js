import { useState } from 'react';

const ShareWithResident = ({ onSubmitForm, smsTemplate }) => {
  const [sendByText, setSendByText] = useState(false);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmitForm(e.target['resident-sms'].value || sendByText);
      }}>
      <div className="govuk-form-group govuk-!-padding-bottom-2 govuk-!-padding-top-8">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <label htmlFor="resident-sms">
              How would the resident like to receive details about their referral to this service?
            </label>
          </legend>
          <div id="resident-referral-hint" className="govuk-hint">
            Optional
          </div>
          <div className="govuk-checkboxes">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="resident-sms"
                name="resident-sms"
                type="checkbox"
                value={true}
                defaultChecked={setSendByText}
                onClick={() => {
                  setSendByText(!sendByText);
                }}
                required
                data-testid="status-change-sms-checkbox"
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="resident-referral-sms">
                By text
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      {sendByText && (
        <>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-padding-top-4">
            Referral note for resident
          </legend>
          <div className="govuk-inset-text" data-testid="sms-template-preview">
            {smsTemplate}
          </div>
        </>
      )}
      <div className="govuk-!-padding-top-4">
        <input
          value="Submit"
          type="submit"
          className="govuk-button"
          name="Submit"
          data-testid="submit-resident-message"
        />
      </div>
    </form>
  );
};

export default ShareWithResident;
