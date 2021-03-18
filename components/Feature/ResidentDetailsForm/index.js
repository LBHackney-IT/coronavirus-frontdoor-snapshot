import React from 'react';
import { useState } from 'react';
import useReferral from 'lib/api/utils/useReferral';

const ResidentDetailsForm = ({
  residentInfoCallback,
  token,
  showResidentForm,
  setShowResidentForm,
  setReferralCompletion,
  referralCompletion
}) => {
  const { createReferral } = useReferral({ token });
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
      residentInfoCallback(residentInfo);
    }
  };

  const onInvalidField = value => {
    Object.values(validationError).every(k => {
      if (value != k) {
        validationError[k] = false;
      }
    });
    setValidationError({ [value]: true, ...validationError });
  };

  const onSubmitForm = async e => {
    e.preventDefault();
    const serviceId = e.target['service-id'].value;
    const referral = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.address.value,
      postcode: e.target.postcode.value,
      referralReason: e.target['referral-reason'].value,
      conversationNotes: e.target['conversation-notes'].value,
      referrerName: e.target['referer-name'].value,
      referrerEmail: e.target['referer-email'].value,
      referrerOrganisation: e.target['referer-organisation'].value,
      dateOfBirth: {
        year: e.target['date-of-birth-year'].value,
        month: e.target['date-of-birth-month'].value,
        day: e.target['date-of-birth-day'].value
      },
      serviceId: serviceId,
      serviceName: e.target['service-name'].value,
      serviceContactEmail: e.target['service-contact-email'].value,
      serviceReferralEmail: e.target['service-referral-email'].value
    };
    const result = await createReferral(referral);
    if (result.id) {
      setReferralCompletion({ ...referralCompletion, [serviceId]: result });
    }
  };
  return (
    <div>
      <h1 className="govuk-heading-l">Who are you helping?</h1>
      <details className="govuk-details" onClick={() => setShowResidentForm(!showResidentForm)}>
        <summary>Residents details</summary>
      </details>

      {
        <form id="resident-details" onSubmit={onSubmitForm} hidden={!showResidentForm}>
          <div
            className={`govuk-form-group ${
              validationError.firstName ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="name">
                First name
              </label>
              <span
                id="name-error"
                className="govuk-error-message"
                aria-describedby="input-name-error">
                <span hidden={!validationError.firstName} data-testid="name-error">
                  Enter the first name
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.firstName ? 'govuk-input--error' : ''
                }`}
                id="firstName"
                name="firstName"
                type="text"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                aria-describedby="firstName"
                onInvalid={e => onInvalidField(e.target.id)}
                required
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.lastName ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="name">
                Last name
              </label>
              <span
                id="name-error"
                className="govuk-error-message"
                aria-describedby="input-name-error">
                <span hidden={!validationError.lastName} data-testid="name-error">
                  Enter the last name
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.lastName ? 'govuk-input--error' : ''
                }`}
                id="lastName"
                name="lastName"
                type="text"
                aria-describedby="lastName"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                onInvalid={e => onInvalidField(e.target.id)}
                required
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.phone ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="phone">
                Phone
              </label>
              <span
                id="phone-error"
                className="govuk-error-message"
                aria-describedby="input-phone-error">
                <span hidden={!validationError.phone} data-testid="phone-error">
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
                onInvalid={e => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.email ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="email">
                Email
              </label>
              <span
                id="email-error"
                className="govuk-error-message"
                aria-describedby="input-email-error">
                <span hidden={!validationError.email} data-testid="email-error">
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
                onInvalid={e => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.address ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="address">
                Address
              </label>
              <span
                id="address-error"
                className="govuk-error-message"
                aria-describedby="input-address-error">
                <span hidden={!validationError.address} data-testid="address-error">
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
                onInvalid={e => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              validationError.postcode ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="postcode">
                Postcode
              </label>
              <span
                id="postcode-error"
                className="govuk-error-message"
                aria-describedby="input-postcode-error">
                <span hidden={!validationError.postcode} data-testid="postcode-error">
                  Enter the postcode
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  validationError.postcode ? 'govuk-input--error' : ''
                }`}
                id="postcode"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={e => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div className="govuk-form-group">
            <fieldset
              className="govuk-fieldset"
              role="group"
              aria-describedby="date-of-birth-section">
              <legend className="govuk-fieldset__legend">Date of birth</legend>
              <div className="govuk-date-input" id="date-of-birth">
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" for="date-of-birth-day">
                      Day
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="date-of-birth-day"
                      name="date-of-birth-day"
                      type="text"
                      pattern="[0-9]*"
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label
                      className="govuk-label govuk-date-input__label"
                      for="date-of-birth-month">
                      Month
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="date-of-birth-month"
                      name="date-of-birth-month"
                      type="text"
                      pattern="[0-9]*"
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" for="date-of-birth-year">
                      Year
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-4"
                      id="date-of-birth-year"
                      name="date-of-birth-year"
                      type="text"
                      pattern="[0-9]*"
                      inputmode="numeric"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      }
    </div>
  );
};

export default ResidentDetailsForm;
