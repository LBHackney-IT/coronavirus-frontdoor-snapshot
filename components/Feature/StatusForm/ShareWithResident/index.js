import { useState } from 'react';

const ShareWithResident = ({ onSubmitForm }) => {
  const [sendByText, setSendByText] = useState(false);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmitForm(e.target['resident-sms'].value || sendByText);
      }}>
      <div className="govuk-form-group govuk-!-padding-bottom-2">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            How would the resident like to receive details about their referral to this service?
          </legend>
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
      <div className="govuk-!-padding-top-4">
        <input
          value="Submit"
          type="submit"
          className="govuk-button"
          name="Submit"
          data-testid="submit-resident-text-form"
        />
      </div>
    </form>
  );
};

export default ShareWithResident;
