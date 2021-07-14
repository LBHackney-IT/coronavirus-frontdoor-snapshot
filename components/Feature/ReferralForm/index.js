import React from 'react';
import { useState } from 'react';
import useReferral from 'lib/api/utils/useReferral';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import { REFERRAL_SUBMIT_SUCCESS, REFERRAL_SUBMIT_INVALID } from 'lib/utils/analyticsConstants';
import ResidentDetails from '../ResidentDetails';

const ReferralForm = ({
  setResidentInfo,
  token,
  setReferralCompletion,
  referralCompletion,
  referralSummary,
  setReferralSummary,
  updateEmailBody,
  setEmailBody,
  referrerData,
  id,
  email,
  name,
  description,
  websites,
  address,
  telephone,
  referralContact,
  referralData,
  setReferrerData,
  setReferralData,
  preserveFormData,
  setPreserveFormData,
  residentInfo,
  detailsClicked,
  categoryId
}) => {
  const { createReferral } = useReferral({ token });

  const [validationError, setValidationError] = useState({});

  const handleOnChange = (id, value) => {
    delete validationError[id];
    if (id == 'email' && value == '') {
      document.getElementById('resident-referral-email').checked = false;
    }
    let newResidentInfo = { ...residentInfo, [id]: value };
    setResidentInfo(newResidentInfo);
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

    setPreserveFormData(false);

    if (result.id) {
      document.getElementById(`resource-container-${id}`)?.scrollIntoView();
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
      {
        <div className={`govuk-grid-row govuk-!-margin-4`}>
          <form
            id={`referral-form-${id}`}
            onInvalid={() => {
              sendDataToAnalytics({
                action: getUserGroup(referrerData['user-groups']),
                category: REFERRAL_SUBMIT_INVALID
              });
            }}
            onSubmit={onSubmitForm}>
            <div
              className={`govuk-grid-column-one-half govuk-!-padding-bottom-2 govuk-!-padding-top-4`}>
              <ResidentDetails
                onInvalidField={onInvalidField}
                validationError={validationError}
                handleOnChange={handleOnChange}
                preserveFormData={preserveFormData}
                residentInfo={residentInfo}
                formType="referral"
              />
            </div>
            <div className={`govuk-grid-column-one-half`}>
              <label htmlFor={`service-name-${id}`} hidden>
                Service name
              </label>
              <input
                id={`service-name-${id}`}
                name="service-name"
                value={name}
                type="text"
                hidden
              />
              <label htmlFor={`service-contact-email-${id}`} hidden>
                Service email
              </label>
              <input
                id={`service-contact-email-${id}`}
                name="service-contact-email"
                value={email}
                type="text"
                hidden
              />
              <label htmlFor={`service-contact-phone-${id}`} hidden>
                Service phone
              </label>
              <input
                id={`service-contact-phone-${id}`}
                name="service-contact-phone"
                value={telephone}
                type="text"
                hidden
              />
              <label htmlFor={`service-referral-email-${id}`} hidden>
                Service referral email
              </label>
              <input
                id={`service-referral-email-${id}`}
                name="service-referral-email"
                value={referralContact}
                type="text"
                hidden
              />
              <label htmlFor={`service-address-${id}`} hidden>
                Service address
              </label>
              <input
                id={`service-address-${id}`}
                name="service-address"
                value={address}
                type="text"
                hidden
              />
              <label htmlFor={`service-websites-${id}`} hidden>
                Service websites
              </label>
              <input
                id={`service-websites-${id}`}
                name="service-websites"
                value={websites.join(' ')}
                type="text"
                hidden
              />
              <label htmlFor={`service-description-${id}`} hidden>
                Service describtion
              </label>
              <input
                id={`service-description-${id}`}
                name="service-description"
                value={description}
                type="text"
                hidden
              />
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 govuk-!-padding-top-4 ${
                  validationError[`referral-reason-${id}`] ? 'govuk-form-group--error' : ''
                }`}>
                <label className="govuk-label inline" htmlFor={`referral-reason-${id}`}>
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    Reason for referral, please give as much detail as possible
                  </legend>
                </label>
                {validationError[`referral-reason-${id}`] && (
                  <span
                    id="referral-reason-error"
                    className={` ${
                      validationError[`referral-reason-${id}`] ? 'govuk-error-message' : ''
                    }`}>
                    <span className="govuk-visually-hidden">Error:</span> Enter more detail
                  </span>
                )}
                <textarea
                  className={`govuk-textarea ${
                    validationError[`referral-reason-${id}`] ? 'govuk-input--error' : ''
                  }`}
                  id={`referral-reason-${id}`}
                  name="referral-reason"
                  rows="5"
                  aria-describedby="referral-reason-error"
                  defaultValue={preserveFormData ? referralData['referral-reason'] : ''}
                  onChange={e => {
                    setReferralData({ ...referralData, 'referral-reason': e.target.value });
                  }}
                  required
                  onInvalid={e => onInvalidField(e.target.id)}></textarea>
              </div>
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 ${
                  validationError[`conversation-notes-${id}`] ? 'govuk-form-group--error' : ''
                }`}>
                <label className="govuk-label inline" htmlFor={`conversation-notes-${id}`}>
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    Notes on wider conversation(other needs, living situation, key information
                  </legend>
                </label>
                {validationError[`conversation-notes-${id}`] && (
                  <span
                    id="conversation-notes-error"
                    className={` ${
                      validationError[`conversation-notes-${id}`] ? 'govuk-error-message' : ''
                    }`}>
                    <span className="govuk-visually-hidden">Error:</span> Enter more detail
                  </span>
                )}
                <textarea
                  className={`govuk-textarea ${
                    validationError[`conversation-notes-${id}`] ? 'govuk-input--error' : ''
                  }`}
                  id={`conversation-notes-${id}`}
                  name="conversation-notes"
                  rows="5"
                  aria-describedby="conversation-notes-error"
                  defaultValue={preserveFormData ? referralData['conversation-notes'] : ''}
                  onChange={e => {
                    setReferralData({
                      ...referralData,
                      'conversation-notes': e.target.value
                    });
                  }}
                  required
                  onInvalid={e => onInvalidField(e.target.id)}></textarea>
              </div>
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 ${
                  validationError[`consent-${id}`] ? 'govuk-form-group--error' : ''
                }`}>
                <fieldset className="govuk-fieldset" aria-describedby="consent-hint">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    The resident is happy for their information to be shared with third parties
                  </legend>
                  <div className="govuk-checkboxes govuk-checkboxes--inline">
                    {validationError[`consent-${id}`] && (
                      <span id={`consent-${id}-error`} className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span>
                        This is required in order to make the referral.
                      </span>
                    )}
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id={`consent-${id}`}
                        name="consent"
                        type="checkbox"
                        value="true"
                        onInvalid={e => onInvalidField(e.target.id)}
                        required
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor={`consent-${id}`}>
                        Yes
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="govuk-form-group govuk-!-padding-bottom-2">
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    How would the resident like to receive details about their referral to this
                    service?
                  </legend>
                  <div id="resident-referral-hint" className="govuk-hint">
                    Select all that apply.
                  </div>
                  <div className="govuk-checkboxes">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="resident-referral-sms"
                        name="resident-referral-sms"
                        type="checkbox"
                        value={true}
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor="resident-referral-sms">
                        By text
                      </label>
                    </div>
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="resident-referral-email"
                        name="resident-referral-email"
                        type="checkbox"
                        value={true}
                        disabled={residentInfo.email == null || residentInfo.email == ''}
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor="resident-referral-email">
                        By email
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div>
                <div
                  className={`govuk-form-group govuk-!-padding-bottom-2 ${
                    validationError[`referer-name-${id}`] ? 'govuk-form-group--error' : ''
                  }`}>
                  <label className="govuk-label inline" htmlFor={`referer-name-${id}`}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Your name
                    </legend>
                  </label>
                  <span
                    id="referrer-name-error"
                    className="govuk-error-message"
                    aria-describedby="input-name-error">
                    <span hidden={!validationError[`referer-name-${id}`]} data-testid="name-error">
                      Enter your name
                    </span>
                  </span>
                  <input
                    className={`govuk-input govuk-!-width-two-thirds ${
                      validationError[`referer-name-${id}`] ? 'govuk-input--error' : ''
                    }`}
                    id={`referer-name-${id}`}
                    name="referer-name"
                    type="text"
                    defaultValue={referrerData['referer-name']}
                    onChange={e => {
                      setReferrerData({ ...referrerData, 'referer-name': e.target.value });
                    }}
                    aria-describedby="refererName-hint"
                    aria-describedby="refererName"
                    onInvalid={e => onInvalidField(e.target.id)}
                    required
                  />
                </div>
                <div
                  className={`govuk-form-group govuk-!-padding-bottom-2 ${
                    validationError[`referer-organisation-${id}`] ? 'govuk-form-group--error' : ''
                  }`}>
                  <label className="govuk-label inline" htmlFor={`referer-organisation-${id}`}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Your organisation
                    </legend>
                  </label>
                  <span
                    id="referrer-organisation-error"
                    className="govuk-error-message"
                    aria-describedby="input-name-error">
                    <span
                      hidden={!validationError[`referer-organisation-${id}`]}
                      data-testid="name-error">
                      Enter your organisation
                    </span>
                  </span>
                  <input
                    className={`govuk-input govuk-!-width-two-thirds ${
                      validationError[`referer-organisation-${id}`] ? 'govuk-input--error' : ''
                    }`}
                    id={`referer-organisation-${id}`}
                    name="referer-organisation"
                    type="text"
                    defaultValue={referrerData['referer-organisation']}
                    onChange={e => {
                      setReferrerData({
                        ...referrerData,
                        'referer-organisation': e.target.value
                      });
                    }}
                    aria-describedby="refererorganisation-hint"
                    aria-describedby="refererorganisation"
                    onInvalid={e => onInvalidField(e.target.id)}
                    required
                  />
                </div>
                <div
                  className={`govuk-form-group govuk-!-padding-bottom-2 ${
                    validationError[`referer-email-${id}`] ? 'govuk-form-group--error' : ''
                  }`}>
                  <label className="govuk-label inline" htmlFor={`referer-email-${id}`}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                      Your email
                    </legend>
                  </label>
                  <span
                    id="referrer-email-error"
                    className="govuk-error-message"
                    aria-describedby="input-name-error">
                    <span hidden={!validationError[`referer-email-${id}`]} data-testid="name-error">
                      Enter your email
                    </span>
                  </span>
                  <input
                    className={`govuk-input govuk-!-width-two-thirds ${
                      validationError[`referer-email-${id}`] ? 'govuk-input--error' : ''
                    }`}
                    id={`referer-email-${id}`}
                    name="referer-email"
                    type="email"
                    defaultValue={referrerData['referer-email']}
                    onChange={e => {
                      setReferrerData({ ...referrerData, 'referer-email': e.target.value });
                    }}
                    aria-describedby="refererorganisation-hint"
                    aria-describedby="refererorganisation"
                    onInvalid={e => onInvalidField(e.target.id)}
                    required
                  />
                  <input value={id} name="service-id" hidden />
                </div>
              </div>
              <div className="govuk-form-group govuk-!-padding-bottom-2">
                <div className="govuk-!-margin-top-4">
                  <button
                    type="button"
                    className="govuk-button govuk-button--secondary govuk-!-margin-right-2"
                    onClick={e => {
                      detailsClicked(e, `referral-${id}-${categoryId}-details`, id);
                      document.getElementById(`resource-container-${id}`)?.scrollIntoView();
                    }}>
                    Cancel
                  </button>
                  <input type="submit" id={`submit-${id}`} className="govuk-button" name="Submit" />
                </div>
              </div>
            </div>
          </form>
        </div>
      }
    </div>
  );
};

export default ReferralForm;
