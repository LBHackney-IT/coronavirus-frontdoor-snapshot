import React from 'react';
import { useState } from 'react';
import useReferral from 'lib/api/utils/useReferral';


const ResidentDetailsForm = ({residentInfoCallback, token}) => {
  const { createReferral } = useReferral({token});
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [residentInfo, setResidentInfo] = useState({
    name: null,
    email: null,
    phone: null,
    address: null,
    postcode: null
  });

  const [validationError, setValidationError] = useState({});

  const handleOnChange = (id, value) => {
    setResidentInfo({ ...residentInfo, [id]: value });
    let newResidentInfo = { ...residentInfo, [id]: value };
    if (Object.values(newResidentInfo).every(k => k)) {
      residentInfoCallback(residentInfo)
    }
  };

  const onInvalidField = (value) => {
    Object.values(validationError).every(k => {
      if(value != k){
        validationError[k] = false
      }
    })
    setValidationError({[value]: true, ...validationError})
  }
  const onSubmitForm = (e) => {
    e.preventDefault();
    const snapshot = {
      firstName: e.target.name.value,
      lastName: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.address.value,
      postcode: e.target.postcode.value,
      referralReason: e.target['referral-reason'].value,
      conversationNotes: e.target['conversation-notes'].value
    }
    createReferral(snapshot)
  }
  return (
    <div>
       <h1 className="govuk-heading-l">Who are you helping?</h1>
      <details className="govuk-details"  onClick={() => setShowAddResidentForm(!showAddResidentForm)}>
        <summary>Residents details</summary>
      </details>

      {(
        <form id='resident-details' onSubmit={onSubmitForm} hidden={showAddResidentForm}>
          <div
            className={`govuk-form-group ${
              validationError.name  ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="name">
                Name
              </label>
              <span id="name-error" className="govuk-error-message" aria-describedby="input-name-error">
                <span
                  hidden={!validationError.name}
                  data-testid="name-error"
                >
                  Enter the name
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.name  ? 'govuk-input--error' : ''
                }`}
                id="name"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                aria-describedby="name"
                onInvalid={(e) => onInvalidField(e.target.id)}
                required
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.phone ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="phone">
                Phone
              </label>
              <span id="phone-error" className="govuk-error-message" aria-describedby="input-phone-error">
                <span
                  hidden={!validationError.phone}
                  data-testid="phone-error"
                >
                  Enter the phone number
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.phone ? 'govuk-input--error' : ''
                }`}
                id="phone"
                name="phone"
                type="number"
                aria-describedby="telephone-number-error"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={(e) => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.email ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="email">
                Email
              </label>
              <span id="email-error" className="govuk-error-message" aria-describedby="input-email-error">
                <span
                  hidden={!validationError.email}
                  data-testid="email-error"
                >
                  Enter the email address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.email ? 'govuk-input--error' : ''
                }`}
                id="email"
                name="email"
                type="email"
                spellCheck="false"
                aria-describedby="email-hint email error"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={(e) => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.address  ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="address">
                Address
              </label>
              <span id="address-error" className="govuk-error-message" aria-describedby="input-address-error">
                <span
                  hidden={!validationError.address}
                  data-testid="address-error"
                >
                  Enter the address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.address ? 'govuk-input--error' : ''
                }`}
                id="address"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={(e) => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.postcode ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="postcode">
                Postcode
              </label>
              <span id="postcode-error" className="govuk-error-message" aria-describedby="input-postcode-error">
                <span
                  hidden={!validationError.postcode}
                  data-testid="postcode-error"
                >
                  Enter the postcode
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.postcode  ? 'govuk-input--error' : ''
                }`}
                id="postcode"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={(e) => onInvalidField(e.target.id)}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResidentDetailsForm;
