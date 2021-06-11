import React from 'react';
import { useState } from 'react';
import useReferral from 'lib/api/utils/useReferral';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import { REFERRAL_SUBMIT_SUCCESS, REFERRAL_SUBMIT_INVALID } from 'lib/utils/analyticsConstants';

const ResidentDetailsForm = ({
  residentInfoCallback,
  token,
  setReferralCompletion,
  referralCompletion,
  referralSummary,
  setReferralSummary,
  updateEmailBody,
  setEmailBody,
  referrerData
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
    delete validationError[id];
    let newResidentInfo = { ...residentInfo, [id]: value };
    setResidentInfo(newResidentInfo);
    residentInfoCallback(newResidentInfo);
  };

  const onInvalidField = value => {
    setValidationError(x => {
      return { [value]: true, ...x };
    });
  };

  const onSubmitForm = async e => {
    e.preventDefault();
    e.target.Submit.setAttribute('disabled', true);
    const serviceId = e.target['service-id'].value;
    const serviceName = e.target['service-name'].value;
    const serviceTelephone = e.target['service-contact-phone'].value;
    const serviceEmail = e.target['service-contact-email'].value;
    const serviceAddress = e.target['service-address'].value;
    const serviceWebsites = e.target['service-websites'].value;
    const referralEmail = e.target['service-referral-email'].value;

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
      serviceId,
      serviceName,
      serviceContactEmail: e.target['service-contact-email'].value,
      serviceReferralEmail: e.target['service-referral-email'].value,
      serviceContactPhone: e.target['service-contact-phone'].value,
      serviceAddress: e.target['service-address'].value,
      serviceWebsite: e.target['service-websites'].value,
      serviceDescription: e.target['service-description'].value,
      sendResidentSms: e.target['resident-referral-sms'].checked,
      sendResidentEmail: e.target['resident-referral-email'].checked
    };
    const result = await createReferral(referral);

    if (result.id) {
      setReferralCompletion({ ...referralCompletion, [serviceId]: result });
      const newReferralSummary = referralSummary.concat([
        {
          name: serviceName,
          telephone: serviceTelephone,
          contactEmail: serviceEmail,
          referralEmail,
          address: serviceAddress,
          websites: serviceWebsites,
          id: serviceId,
          referralId: result.id
        }
      ]);
      setReferralSummary(newReferralSummary);
      setEmailBody(updateEmailBody(undefined, newReferralSummary));
      sendDataToAnalytics({
        action: getUserGroup(referrerData['user-groups']),
        category: REFERRAL_SUBMIT_SUCCESS,
        label: serviceName
      });
    }
  };
  return (
    <div>
      <h3 className="govuk-heading-m" id="resident-details-header">
        Who are you helping?
      </h3>

      {
        <form
          id="resident-details"
          onInvalid={() => {
            sendDataToAnalytics({
              action: getUserGroup(referrerData['user-groups']),
              category: REFERRAL_SUBMIT_INVALID
            });
          }}
          onSubmit={onSubmitForm}>
          <div
            className={`govuk-form-group ${
              validationError.firstName ? 'govuk-form-group--error' : ''
            }`}>
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="firstName">
                First name
              </label>
              <span id="name-error" className="govuk-error-message">
                <span hidden={!validationError.firstName} data-testid="name-error">
                  Enter the first name
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.firstName ? 'govuk-input--error' : ''}`}
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
              <label className="govuk-label inline" htmlFor="lastName">
                Last name
              </label>
              <span id="name-error" className="govuk-error-message">
                <span hidden={!validationError.lastName} data-testid="name-error">
                  Enter the last name
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.lastName ? 'govuk-input--error' : ''}`}
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
              <span id="phone-error" className="govuk-error-message">
                <span hidden={!validationError.phone} data-testid="phone-error">
                  Enter the phone number
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.phone ? 'govuk-input--error' : ''}`}
                id="phone"
                name="phone"
                type="number"
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
              <span id="email-error" className="govuk-error-message">
                <span hidden={!validationError.email} data-testid="email-error">
                  Enter the email address
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.email ? 'govuk-input--error' : ''}`}
                id="email"
                name="email"
                type="email"
                spellCheck="false"
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
              <span id="address-error" className="govuk-error-message">
                <span hidden={!validationError.address} data-testid="address-error">
                  Enter the address
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.address ? 'govuk-input--error' : ''}`}
                id="address"
                name="event-name"
                type="text"
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
              <span id="postcode-error" className="govuk-error-message">
                <span hidden={!validationError.postcode} data-testid="postcode-error">
                  Enter the postcode
                </span>
              </span>
              <input
                className={`govuk-input  ${validationError.postcode ? 'govuk-input--error' : ''}`}
                id="postcode"
                name="event-name"
                type="text"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
                onInvalid={e => onInvalidField(e.target.id)}
              />
            </div>
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset" role="group">
              <legend className="govuk-fieldset__legend">Date of birth</legend>
              <div className="govuk-date-input" id="date-of-birth">
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label
                      className="govuk-label govuk-date-input__label"
                      htmlFor="date-of-birth-day">
                      Day
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="date-of-birth-day"
                      name="date-of-birth-day"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={e => handleOnChange(e.target.id, e.target.value)}
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label
                      className="govuk-label govuk-date-input__label"
                      htmlFor="date-of-birth-month">
                      Month
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="date-of-birth-month"
                      name="date-of-birth-month"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={e => handleOnChange(e.target.id, e.target.value)}
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label
                      className="govuk-label govuk-date-input__label"
                      htmlFor="date-of-birth-year">
                      Year
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-4"
                      id="date-of-birth-year"
                      name="date-of-birth-year"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={e => handleOnChange(e.target.id, e.target.value)}
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
