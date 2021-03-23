import css from './index.module.scss';
import SummaryList from 'components/Form/SummaryList';
import { useState } from 'react';

const HIDDEN_TAGS = ['Delivery', 'Collection', 'Food'];

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
  refererInfo,
  referralCompletion,
  setReferralCompletion,
  detailsClicked,
  openReferralForm,
  referralData,
  setReferralData,
  ...others
}) => {
  const [validationError, setValidationError] = useState({});

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const websiteElement =
    websites &&
    websites.length > 0 &&
    websites.map(website => (
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
    ));
  const distributionElement = tags.filter(t => HIDDEN_TAGS.includes(t)).join(', ');
  const tagsElement = tags
    .filter(t => !HIDDEN_TAGS.includes(t))
    .map(item => (
      <span key={'tags-' + item} className={`${css.tags} tag-element ${css[`${item}-tag`]}`}>
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

  const copyToClipboard = () => {
    var copyText = document.getElementById(`resource-${name}`);
    copyText.hidden = false;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    copyText.hidden = true;
  };

  const clipboardServiceDetails =
    'Service Name: ' +
    name +
    (telephone ? '\nTelephone: ' + telephone : '') +
    (serviceDescription ? '\nService Description: ' + serviceDescription : '') +
    (address ? '\nAddress: ' + address : '') +
    (description ? '\nDescription: ' + description : '') +
    (websites.length > 0
      ? '\nWebsites: ' +
        JSON.stringify(websites)
          .replace('[', '')
          .replace(']', '')
      : '') +
    (referralWebsite ? '\nReferral website: ' + referralWebsite : '') +
    (referralContact ? '\nReferral email: ' + referralContact : '');

  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div className={`${css.tags__container} card-header-tag`} data-testid="resource-card-tags">
        {tagsElement}
      </div>
      <textarea id={`resource-${name}`} type="hidden" value={clipboardServiceDetails} hidden />
      <h3>
        {name}{' '}
        <a
          id={`copy-clipboard-icon-${id}`}
          title="copy"
          href="javascript:void(0)"
          onClick={() => copyToClipboard()}>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
        </a>
      </h3>
      <>
        <SummaryList
          key={`resourceInfo-${id}-${categoryId}`}
          name={['resourceInfo']}
          entries={{
            Distance: distance && distance < 100 ? distance + ' miles' : null,
            Distribution: distributionElement,
            Telephone: telephone,
            'Service Description': serviceDescription,
            Address: address,
            Description: description,
            Website: websiteElement,
            'Additional notes': notes
          }}
          customStyle="small"
        />
      </>
      {referralContact?.length > 0 && (
        <details
          className="govuk-details"
          name="refer-details"
          id={`referral-${id}-${categoryId}-details`}
          data-module="govuk-details">
          <summary
            id={`referral-${id}-${categoryId}`}
            type="submit"
            form="resident-details"
            onClick={e => {
              detailsClicked(e, `referral-${id}-${categoryId}-details`, id, categoryName);
            }}>
            Refer
          </summary>
          {openReferralForm.id == id &&
            openReferralForm.categoryName == categoryName &&
            !referralCompletion[id] && (
              <div id={`referral-${id}-${categoryId}-form`}>
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
                  className={`govuk-form-group govuk-!-padding-bottom-2 ${
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
                    validationError[`conversation-notes-${id}`] ? 'govuk-form-group--error' : ''
                  }`}>
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    Notes on wider conversation(other needs, living situation, key information
                  </legend>
                  {validationError[`conversation-notes-${id}`] && (
                    <span
                      id="more-detail-error"
                      className={` ${
                        validationError[`conversation-notes-${id}`] ? 'govuk-error-message' : ''
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
                      setReferralData({ ...referralData, 'conversation-notes': e.target.value });
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
                        <span id={`consent-${id}-error`} class="govuk-error-message">
                          <span class="govuk-visually-hidden">Error:</span>
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
                          for={`consent-${id}`}>
                          Yes
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div class="govuk-form-group govuk-!-padding-bottom-2">
                  <fieldset class="govuk-fieldset">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
                      How would the resident like to receive details about their referral to this
                      service?
                    </legend>
                    <div id="resident-referral-hint" class="govuk-hint">
                      Select all that apply.
                    </div>
                    <div class="govuk-checkboxes">
                      <div class="govuk-checkboxes__item">
                        <input
                          class="govuk-checkboxes__input"
                          id="resident-referral-sms"
                          name="resident-referral-sms"
                          type="checkbox"
                          form="resident-details"
                          value={true}
                        />
                        <label
                          class="govuk-label govuk-checkboxes__label"
                          for="resident-referral-sms">
                          By text
                        </label>
                      </div>
                      <div class="govuk-checkboxes__item">
                        <input
                          class="govuk-checkboxes__input"
                          id="resident-referral-email"
                          name="resident-referral-email"
                          type="checkbox"
                          form="resident-details"
                          value={true}
                        />
                        <label
                          class="govuk-label govuk-checkboxes__label"
                          for="esident-referral-email">
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
                    <label className="govuk-label inline" htmlFor="name">
                      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
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
                      defaultValue={referralData['referer-name']}
                      onChange={e => {
                        setReferralData({ ...referralData, 'referer-name': e.target.value });
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
                    <label className="govuk-label inline" htmlFor="name">
                      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
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
                        validationError[`referer-organisation-${id}`] ? 'govuk-input--error' : ''
                      }`}
                      id={`referer-organisation-${id}`}
                      name="referer-organisation"
                      type="text"
                      defaultValue={referralData['referer-organisation']}
                      onChange={e => {
                        setReferralData({
                          ...referralData,
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
                    <label className="govuk-label inline" htmlFor="name">
                      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
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
                      defaultValue={referralData['referer-email']}
                      onChange={e => {
                        setReferralData({ ...referralData, 'referer-email': e.target.value });
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
        </details>
      )}

      {referralCompletion[id] && (
        <div>
          {referralCompletion[id].errors?.length > 0 ? (
            <div data-testid="referral-errors-banner" className={`${css['error-message']}`}>
              {referralCompletion[id].errors.join('\n')}
            </div>
          ) : (
            <div data-testid="successful-referral-banner" className={`${css['success-message']}`}>
              Successfully submitted referral
            </div>
          )}
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
    </div>
  );
};

export default ResourceCard;
