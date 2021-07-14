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
import ResidentDetails from '../ResidentDetails';

const SupportSummary = ({
  referralSummary,
  signpostSummary,
  referrerData,
  setReferrerData,
  emailBody,
  setEmailBody,
  token,
  updateSignpostSummary,
  setResidentInfo,
  residentInfo,
  updateEmailBody,
  preserveFormData,
  setPreserveFormData
}) => {
  const [validationError, setValidationError] = useState({});
  const [analyticsSubmitted, setAnalyticsSubmitted] = useState(false);

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

  const handleOnChange = (id, value) => {
    delete validationError[id];
    let newResidentInfo = { ...residentInfo, [id]: value };
    setResidentInfo(newResidentInfo);
    setEmailBody(updateEmailBody(undefined, undefined, undefined, newResidentInfo));
  };

  const sendSummary = async e => {
    e.preventDefault();
    e.target['submit-summary'].setAttribute('disabled', true);
    const summary = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.address.value,
      postcode: e.target.postcode.value,
      userOrganisation: e.target['summary-organisation'].value,
      userName: e.target['summary-name'].value,
      userEmail: e.target['summary-email'].value,
      dateOfBirth: {
        year: e.target['date-of-birth-year'].value,
        month: e.target['date-of-birth-month'].value,
        day: e.target['date-of-birth-day'].value
      },
      discussedServices: signpostSummary.concat(referralSummary),
      signPostingMessage: e.target['support-summary-note'].value
    };

    setPreserveFormData(false);

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
      <h1 className={`govuk-heading-l`} id="summary-header">
        Send a summary of today's support
      </h1>
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
                          data-testid="remove-from-summary"
                          role="button"
                          aria-label={`remove ${signpost.name} from summary`}>
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
            <form
              id="summary-form"
              onInvalid={() => {
                if (!analyticsSubmitted) {
                  onInvalidAnalytics();
                  setAnalyticsSubmitted(true);
                }
              }}
              onSubmit={sendSummary}>
              <ResidentDetails
                onInvalidField={onInvalidField}
                validationError={validationError}
                handleOnChange={handleOnChange}
                preserveFormData={preserveFormData}
                residentInfo={residentInfo}
                formType="summary"
              />
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
                  const newReferrerData = { ...referrerData, 'referer-name': value };
                  setReferrerData(newReferrerData);
                  setEmailBody(updateEmailBody(undefined, undefined, newReferrerData));
                }}
                validate
                required={true}
              />
              <TextInput
                label="Email"
                name="summary-email"
                value={referrerData['referer-email']}
                onChange={value => {
                  const newReferrerData = { ...referrerData, 'referer-email': value };
                  setReferrerData(newReferrerData);
                  setEmailBody(updateEmailBody(undefined, undefined, newReferrerData));
                }}
                validate
                required={true}
              />
              <TextInput
                label="Organisation"
                name="summary-organisation"
                value={referrerData['referer-organisation']}
                onChange={value => {
                  const newReferrerData = { ...referrerData, 'referer-organisation': value };
                  setReferrerData(newReferrerData);
                  setEmailBody(updateEmailBody(undefined, undefined, newReferrerData));
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
