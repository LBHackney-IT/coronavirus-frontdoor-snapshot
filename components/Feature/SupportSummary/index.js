import { TextArea, TextInput, Button } from 'components/Form';
import Details from 'components/Form/Details';
import Heading from 'components/Heading';
import { useState } from 'react';
import useConversation from 'lib/api/utils/useConversation';
import css from '../notification-messages.module.scss';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import {
  SEND_SUMMARY_SUCCESS,
  SEND_SUMMARY_INVALID_COUNT,
  SEND_SUMMARY_SUCCESS_COUNT
} from 'lib/utils/analyticsConstants';

const SupportSummary = ({
  referralSummary,
  signpostSummary,
  referrerData,
  setReferrerData,
  emailBody,
  setEmailBody,
  residentInfo,
  token,
  updateSignpostSummary
}) => {
  const [validationError, setValidationError] = useState({});

  const { createConversation } = useConversation({ token });

  const [hideForm, setHideForm] = useState(true);
  const [formErrorMsg, setFormErrorMsg] = useState(false);
  const [conversationCompletion, setConversationCompletion] = useState(null);
  const [toBeDeleted, setToBeDeleted] = useState(null);

  const toggleDetail = e => {
    if (referralSummary.length < 1 && signpostSummary.length < 1) {
      e.preventDefault();
      setFormErrorMsg(true);
    } else {
      setFormErrorMsg(false);
      setHideForm(!hideForm);
    }
  };

  const onInvalidField = value => {
    setValidationError(x => {
      return { [value]: true, ...x };
    });
  };

  const sendSummary = async e => {
    e.preventDefault();
    e.target['submit-summary'].setAttribute('disabled', true);
    const summary = {
      firstName: residentInfo.firstName,
      lastName: residentInfo.lastName,
      phone: residentInfo.phone,
      email: residentInfo.email,
      address: residentInfo.address,
      postcode: residentInfo.postcode,
      userOrganisation: e.target['summary-organisation'].value,
      userName: e.target['summary-name'].value,
      userEmail: e.target['summary-email'].value,
      dateOfBirth: {
        year: residentInfo['date-of-birth-year'],
        month: residentInfo['date-of-birth-month'],
        day: residentInfo['date-of-birth-day']
      },
      discussedServices: signpostSummary.concat(referralSummary),
      signPostingMessage: e.target['support-summary-note'].value
    };

    const result = await createConversation(summary);
    if (result.id) {
      setConversationCompletion(result);
      setHideForm(true);
      sendDataToAnalytics({
        action: getUserGroup(referrerData['user-groups']),
        category: SEND_SUMMARY_SUCCESS_COUNT,
        label: signpostSummary.length
      });

      signpostSummary.forEach(signpost => {
        sendDataToAnalytics({
          action: getUserGroup(referrerData['user-groups']),
          category: SEND_SUMMARY_SUCCESS,
          label: signpost.name
        });
      });
    }
  };

  const onInvalidAnalytics = () => {
    sendDataToAnalytics({
      action: getUserGroup(referrerData['user-groups']),
      category: SEND_SUMMARY_INVALID_COUNT,
      label: signpostSummary.length
    });
  };

  return (
    <>
      <Heading as="h2" id="summary-header">
        Send a summary of today's support
      </Heading>
      <Details
        title="Email the resident with details of services"
        id="summary-form"
        onclick={e => {
          toggleDetail(e);
        }}>
        {conversationCompletion && (
          <div>
            {conversationCompletion.errors?.length > 0 ? (
              <div data-testid="conversation-errors-banner" className={`${css['error-message']}`}>
                {conversationCompletion.errors.join('\n')}
              </div>
            ) : (
              <div
                data-testid="successful-conversation-banner"
                className={`${css['success-message']}`}>
                Successfully submitted conversation
              </div>
            )}
            <h4 data-testid="conversation-competition-msg">
              To help another resident please{' '}
              <a href="javascript:window.location.href=window.location.href">refresh this page</a>
            </h4>
          </div>
        )}
        {!hideForm && (
          <div className="govuk-details__text">
            <strong>Services referred to</strong>
            {referralSummary.length == 0 && (
              <span id="summary-referrals-hint" className="govuk-hint  lbh-hint">
                Search for services to refer residents to
              </span>
            )}
            <div className="govuk-!-margin-bottom-5">
              {referralSummary.length > 0 &&
                referralSummary.map(referral => (
                  <div className="govuk-!-margin-bottom-1">{referral.name}</div>
                ))}
            </div>
            <strong>Services signposted to</strong>
            {signpostSummary.length == 0 && (
              <span id="summary-signposts-hint" className="govuk-hint  lbh-hint">
                Search for services to signpost residents to
              </span>
            )}
            <div className="govuk-!-margin-bottom-5">
              {signpostSummary.length > 0 &&
                signpostSummary.map(signpost => (
                  <div className="govuk-!-margin-bottom-1">
                    {toBeDeleted != signpost.name && (
                      <>
                        <button
                          onClick={() => setToBeDeleted(signpost.name)}
                          className={styles['remove-button']}
                          disabled={toBeDeleted == signpost.name}
                          data-testid="remove-from-summary">
                          <FontAwesomeIcon icon={faTimesCircle} color="red" />
                        </button>
                        {signpost.name}
                      </>
                    )}
                    {toBeDeleted == signpost.name && (
                      <div>
                        <strong className={styles['remove-prompt']}>
                          Are you sure you wish to remove {signpost.name} from the summary?
                        </strong>
                        <button
                          className={`govuk-button govuk-button--secondary ${styles['button']}`}
                          onClick={() => setToBeDeleted(null)}
                          data-testid="remove-from-summary-no">
                          No
                        </button>
                        <button
                          onClick={() => updateSignpostSummary(signpost)}
                          className={`govuk-button ${styles['button']}`}
                          data-testid="remove-from-summary-yes">
                          Yes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <form id="summary-form" onInvalid={() => onInvalidAnalytics()} onSubmit={sendSummary}>
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
                    className={`govuk-input  ${
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
                  <label className="govuk-label inline" htmlFor="lastName">
                    Last name
                  </label>
                  <span id="name-error" className="govuk-error-message">
                    <span hidden={!validationError.lastName} data-testid="name-error">
                      Enter the last name
                    </span>
                  </span>
                  <input
                    className={`govuk-input  ${
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
                    className={`govuk-input  ${
                      validationError.address ? 'govuk-input--error' : ''
                    }`}
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
                    className={`govuk-input  ${
                      validationError.postcode ? 'govuk-input--error' : ''
                    }`}
                    id="postcode"
                    name="event-name"
                    type="text"
                    onChange={e => handleOnChange(e.target.id, e.target.value)}
                    required
                    onInvalid={e => onInvalidField(e.target.id)}
                  />
                </div>
              </div>
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

              <TextArea
                value={emailBody}
                label="Add a note for the resident"
                name="support-summary-note"
                rows="20"
                onChange={value => {
                  setEmailBody(value);
                }}
              />
              <strong>Your details</strong>
              <TextInput
                label="Name"
                name="summary-name"
                value={referrerData['referer-name']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-name': value });
                }}
                validate
                required={true}
              />
              <TextInput
                label="Email"
                name="summary-email"
                value={referrerData['referer-email']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-email': value });
                }}
                validate
                required={true}
              />
              <TextInput
                label="Organisation"
                name="summary-organisation"
                value={referrerData['referer-organisation']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-organisation': value });
                }}
                validate
                required={true}
              />
              <Button type="submit" text="Send" id="summary-submit" name="submit-summary" />
            </form>
          </div>
        )}
      </Details>
      {formErrorMsg && (
        <div className="govuk-!-margin-top-4">
          <div className={`${css['error-message']}`} id="summary-error">
            <a href="#resources-header">
              Please make a referral or choose at least one service to add to summary
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportSummary;
