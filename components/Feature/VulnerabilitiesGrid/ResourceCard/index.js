import css from './index.module.scss';
import notificationCss from '../../notification-messages.module.scss';
import { useState } from 'react';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import {
  REFERRAL_OPEN,
  REFERRAL_CLICK_WEBSITE,
  SERVICE_CLICK_WEBSITE,
  VIEW_SUMMARY_EMAIL_CLICKED
} from 'lib/utils/analyticsConstants';

const ResourceCard = ({
  id,
  updateSelectedResources,
  name,
  description,
  websites,
  address,
  postcode,
  tags,
  telephone,
  email,
  referralContact,
  referralWebsite,
  notes,
  distance,
  matches,
  customerId,
  categoryName,
  serviceDescription,
  residentInfo,
  categoryId,
  referralCompletion,
  setReferralCompletion,
  detailsClicked,
  openReferralForm,
  referralData,
  setReferralData,
  referrerData,
  setReferrerData,
  demographic,
  updateSignpostSummary,
  signpostSummary,
  councilTags,
  ...others
}) => {
  const [validationError, setValidationError] = useState({});
  const [noteOpen, setNoteOpen] = useState(false);

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const tagsElement = tags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element`}>
      {trimLength(item, 20)}
    </span>
  ));
  const councilTagsElement = councilTags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element ${css[`Council-tag`]}`}>
      {trimLength(item, 20)}
    </span>
  ));
  const snapshot = customerId != undefined ? true : false;
  const updateResource = () => {
    updateSelectedResources({
      name: name,
      description: description,
      address: address,
      telephone: telephone,
      email: email,
      referralContact: referralContact,
      websites: websites,
      notes: notes
    });
  };

  const onInvalidField = value => {
    Object.values(validationError).every(k => {
      if (value != k) {
        validationError[k] = false;
      }
    });
    setValidationError({ [value]: true, ...validationError });
  };

  const fullDescription = serviceDescription + ' ' + description;
  const first = fullDescription?.substring(0, 250);
  const second = fullDescription?.substring(250);

  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div className={`${css.tags__container} card-header-tag`} data-testid="resource-card-tags">
        {tagsElement}
        {councilTagsElement}
      </div>
      <div>
        <div className={`govuk-grid-row`}>
          <div
            className={`govuk-grid-column-two-thirds header-container ${css['header-container']}`}>
            <h3 data-testid="resource-card-header">
              {websites?.length > 0 ? (
                <a
                  key={`website-link-${websites[0]}`}
                  href={websites[0]}
                  target="_blank"
                  onClick={() => {
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: SERVICE_CLICK_WEBSITE,
                      label: name
                    });
                  }}
                  rel="noopener noreferrer">
                  {name}
                </a>
              ) : (
                { name }
              )}
            </h3>
            {demographic?.length > 0 && <span>This is for {demographic}</span>}
          </div>

          <div className={`govuk-grid-column-one-third ${css['contact-container']}`}>
            {telephone?.length > 0 && <h4>{telephone}</h4>}

            {email?.includes('@') && (
              <div>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}

            {address?.length > 0 && <span>{address}</span>}
          </div>
        </div>
        {fullDescription && (
          <p>
            {first}
            {second.length > 0 && !noteOpen ? (
              <>
                ...
                <button onClick={() => setNoteOpen(true)} className={css['toggle-button']}>
                  Show more
                </button>
              </>
            ) : (
              ''
            )}
            {noteOpen && second}
            {noteOpen && (
              <button onClick={() => setNoteOpen(false)} className={css['toggle-button']}>
                Show less
              </button>
            )}
          </p>
        )}
        <div className={`govuk-grid-row`}>
          <div className={`govuk-grid-column-one-half`}>
            <div className={`govuk-checkboxes__item ${css['inline-header']}`}>
              <input
                className="govuk-checkboxes__input"
                id={`add-to-summary-checkbox-${id}-${categoryId}`}
                name="add-to-summary-checkbox"
                type="checkbox"
                onClick={() => {
                  updateSignpostSummary({
                    id,
                    name,
                    telephone,
                    contactEmail: email,
                    referralEmail: referralContact,
                    address,
                    websites: websites.join(', '),
                    categoryName
                  });
                }}
                value={true}
                checked={signpostSummary?.some(x => x.name == name)}
              />
              <label
                className={`govuk-label govuk-checkboxes__label ${css['checkbox-label']}`}
                htmlFor={`add-to-summary-checkbox-${id}-${categoryId}`}>
                Share service with a resident
              </label>
            </div>
          </div>
          <div className={`govuk-grid-column-one-half`}>
            {referralContact?.length > 0 ? (
              <span id={`referral-${id}-${categoryId}-details`} name="refer-details">
                <button
                  id={`referral-${id}-${categoryId}`}
                  className={`govuk-button ${css['refer-button']} 
                  ${
                    openReferralForm.id == id && openReferralForm.categoryName == categoryName
                      ? 'govuk-button--secondary'
                      : ''
                  } `}
                  type="button"
                  data-testid="refer-button"
                  onClick={e => {
                    detailsClicked(e, `referral-${id}-${categoryId}-details`, id, categoryName);
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: REFERRAL_OPEN,
                      label: name
                    });
                  }}>
                  {openReferralForm.id == id && openReferralForm.categoryName == categoryName
                    ? 'Cancel'
                    : 'Create Referral'}
                </button>
                {openReferralForm.id == id &&
                  openReferralForm.categoryName == categoryName &&
                  !referralCompletion[id] && (
                    <div id={`referral-${id}-${categoryId}-form`} className={css['referral-form']}>
                      <input
                        form="resident-details"
                        id={`service-name-${id}`}
                        name="service-name"
                        value={name}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
                        id={`service-contact-email-${id}`}
                        name="service-contact-email"
                        value={email}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
                        id={`service-contact-phone-${id}`}
                        name="service-contact-phone"
                        value={telephone}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
                        id={`service-referral-email-${id}`}
                        name="service-referral-email"
                        value={referralContact}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
                        id={`service-address-${id}`}
                        name="service-address"
                        value={address}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
                        id={`service-websites-${id}`}
                        name="service-websites"
                        value={websites.join(' ')}
                        type="text"
                        hidden
                      />
                      <input
                        form="resident-details"
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
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                          Reason for referral, please give as much detail as possible
                        </legend>
                        {validationError[`referral-reason-${id}`] && (
                          <span
                            id="more-detail-error"
                            className={` ${
                              validationError[`referral-reason-${id}`] ? 'govuk-error-message' : ''
                            }`}>
                            <span className="govuk-visually-hidden">Error:</span> Enter more detail
                          </span>
                        )}
                        <textarea
                          form="resident-details"
                          className={`govuk-textarea ${
                            validationError[`referral-reason-${id}`] ? 'govuk-input--error' : ''
                          }`}
                          id={`referral-reason-${id}`}
                          name="referral-reason"
                          rows="5"
                          aria-describedby="more-detail-hint more-detail-error"
                          defaultValue={referralData['referral-reason']}
                          onChange={e => {
                            setReferralData({ ...referralData, 'referral-reason': e.target.value });
                          }}
                          required
                          onInvalid={e => onInvalidField(e.target.id)}></textarea>
                      </div>
                      <div
                        className={`govuk-form-group govuk-!-padding-bottom-2 ${
                          validationError[`conversation-notes-${id}`]
                            ? 'govuk-form-group--error'
                            : ''
                        }`}>
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                          Notes on wider conversation(other needs, living situation, key information
                        </legend>
                        {validationError[`conversation-notes-${id}`] && (
                          <span
                            id="more-detail-error"
                            className={` ${
                              validationError[`conversation-notes-${id}`]
                                ? 'govuk-error-message'
                                : ''
                            }`}>
                            <span className="govuk-visually-hidden">Error:</span> Enter more detail
                          </span>
                        )}
                        <textarea
                          form="resident-details"
                          className={`govuk-textarea ${
                            validationError[`conversation-notes-${id}`] ? 'govuk-input--error' : ''
                          }`}
                          id={`conversation-notes-${id}`}
                          name="conversation-notes"
                          rows="5"
                          aria-describedby="more-detail-hint more-detail-error"
                          defaultValue={referralData['conversation-notes']}
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
                            The resident is happy for their information to be shared with third
                            parties
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
                                form="resident-details"
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
                            How would the resident like to receive details about their referral to
                            this service?
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
                                form="resident-details"
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
                                form="resident-details"
                                value={true}
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
                            id="name-error"
                            className="govuk-error-message"
                            aria-describedby="input-name-error">
                            <span
                              hidden={!validationError[`referer-name-${id}`]}
                              data-testid="name-error">
                              Enter your name
                            </span>
                          </span>
                          <input
                            form="resident-details"
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
                            validationError[`referer-organisation-${id}`]
                              ? 'govuk-form-group--error'
                              : ''
                          }`}>
                          <label
                            className="govuk-label inline"
                            htmlFor={`referer-organisation-${id}`}>
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                              Your organisation
                            </legend>
                          </label>
                          <span
                            id="name-error"
                            className="govuk-error-message"
                            aria-describedby="input-name-error">
                            <span
                              hidden={!validationError[`referer-organisation-${id}`]}
                              data-testid="name-error">
                              Enter your organisation
                            </span>
                          </span>
                          <input
                            form="resident-details"
                            className={`govuk-input govuk-!-width-two-thirds ${
                              validationError[`referer-organisation-${id}`]
                                ? 'govuk-input--error'
                                : ''
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
                            id="name-error"
                            className="govuk-error-message"
                            aria-describedby="input-name-error">
                            <span
                              hidden={!validationError[`referer-email-${id}`]}
                              data-testid="name-error">
                              Enter your email
                            </span>
                          </span>
                          <input
                            form="resident-details"
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
                          <input form="resident-details" value={id} name="service-id" hidden />
                        </div>
                      </div>
                      <div className="govuk-form-group govuk-!-padding-bottom-2">
                        <div className="govuk-!-margin-top-4">
                          <input
                            type="submit"
                            id={`submit-${id}`}
                            className="govuk-button"
                            name="Submit"
                            form="resident-details"
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </span>
            ) : (
              referralWebsite?.length > 0 &&
              (referralWebsite.startsWith('http') ? (
                <a
                  href={referralWebsite}
                  target="_blank"
                  onClick={() =>
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: REFERRAL_CLICK_WEBSITE,
                      label: name
                    })
                  }
                  data-testid="refer-link"
                  className={css['refer-link']}>
                  Refer via external website
                </a>
              ) : (
                <span className={css['refer-text']} data-testid="refer-text">
                  <h4>Referral information</h4>
                  <span>{referralWebsite}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {referralCompletion[id] && (
        <div>
          {referralCompletion[id].errors?.length > 0 ? (
            <div
              data-testid="referral-errors-banner"
              className={`${notificationCss['error-message']}`}>
              {referralCompletion[id].errors.join('\n')}
            </div>
          ) : (
            <div
              data-testid="successful-referral-banner"
              className={`${notificationCss['success-message']}`}>
              Successfully submitted referral
            </div>
          )}
        </div>
      )}
      {signpostSummary?.some(x => x.name == name) && (
        <div
          className={`${css['success-message']}`}
          data-testid={`added-to-summary-banner-${id}-${categoryId}`}>
          You have added a service to your sumary email
          <a
            className={`${css['summary-link']}`}
            href="#summary-header"
            onClick={() =>
              sendDataToAnalytics({
                action: getUserGroup(referrerData['user-groups']),
                category: VIEW_SUMMARY_EMAIL_CLICKED,
                label: name
              })
            }>
            View summary email
          </a>
        </div>
      )}
      {snapshot && (
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={`input-${id}`}
            onClick={() => updateResource()}
            type="checkbox"
            value={name}
          />
          <label className="govuk-label govuk-checkboxes__label" id={`label-${id}`}>
            Would you like to recommend this resource?
          </label>
        </div>
      )}
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
    </div>
  );
};

export default ResourceCard;
