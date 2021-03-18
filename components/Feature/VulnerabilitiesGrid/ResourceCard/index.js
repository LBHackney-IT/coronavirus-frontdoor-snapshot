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
  residentFormCallback,
  referralCompletion,
  setReferralCompletion,
  ...others
}) => {
  const [validationError, setValidationError] = useState({});
  const [hideForm, setHideForm] = useState(true);
  const [referrerData, setReferrerData] = useState({
    name: refererInfo?.name,
    email: refererInfo?.email,
    organisation: refererInfo?.iss
  });

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const websiteElement =
    websites &&
    websites.length > 0 &&
    websites.map(website => (
      <div>
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      </div>
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
      <details className="govuk-details" data-module="govuk-details">
        {process.env.REFERRALS_ENABLED == 'true' && referralContact?.length > 0 && (
          <summary
            id={`referral-${id}`}
            type="submit"
            form="resident-details"
            onClick={() => {
              residentFormCallback(hideForm);
              setHideForm(!hideForm);
            }}>
            Refer
          </summary>
        )}
        {!hideForm && !referralCompletion[id] && (
          <div hidden={hideForm} id={`referral-${id}-form`}>
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
              id={`service-referral-email-${id}`}
              name="service-referral-email"
              value={referralContact}
              type="text"
              hidden
            />
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`referral-reason-${id}`] ? 'govuk-form-group--error' : ''
              }`}>
              <legend className="govuk-fieldset__legend">
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
                required
                onInvalid={e => onInvalidField(e.target.id)}></textarea>
            </div>
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`conversation-notes-${id}`] ? 'govuk-form-group--error' : ''
              }`}>
              <legend className="govuk-fieldset__legend">
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
                required
                onInvalid={e => onInvalidField(e.target.id)}></textarea>
            </div>
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`consent-${id}`] ? 'govuk-form-group--error' : ''
              }`}>
              <fieldset className="govuk-fieldset" aria-describedby="consent-hint">
                <legend className="govuk-fieldset__legend">
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
                    <label className="govuk-label govuk-checkboxes__label" for={`consent-${id}`}>
                      Yes
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
                  Your name
                </label>
                <span
                  id="name-error"
                  className="govuk-error-message"
                  aria-describedby="input-name-error">
                  <span hidden={!validationError[`referer-name-${id}`]} data-testid="name-error">
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
                  value={referrerData?.name}
                  type="text"
                  onChange={e => {
                    const newFullNameVal = e.target.value;
                    setReferrerData({ ...referrerData, name: newFullNameVal });
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
                  Your organisation
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
                  onChange={e => {
                    const newOrganisationVal = e.target.value;
                    setReferrerData({
                      ...referrerData,
                      organisation: newOrganisationVal
                    });
                  }}
                  aria-describedby="refererorganisation-hint"
                  aria-describedby="refererorganisation"
                  onInvalid={e => onInvalidField(e.target.id)}
                  value={referrerData?.organisation} //we probably dont want this, im not sure if exrternal users will have iss set for them as their own org
                  required
                />
              </div>
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 ${
                  validationError[`referer-email-${id}`] ? 'govuk-form-group--error' : ''
                }`}>
                <label className="govuk-label inline" htmlFor="name">
                  Your email
                </label>
                <span
                  id="name-error"
                  className="govuk-error-message"
                  aria-describedby="input-name-error">
                  <span hidden={!validationError[`referer-email-${id}`]} data-testid="name-error">
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
                  onChange={e => {
                    const newEmailVal = e.target.value;
                    setReferrerData({ ...referrerData, email: newEmailVal });
                  }}
                  value={referrerData?.email}
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

      {referralCompletion[id] && (
        <div>
          {referralCompletion[id].errors?.length > 0 ? (
            <div className={`${css['error-message']}`}>{referralCompletion[id].errors}</div>
          ) : (
            <div className={`${css['success-message']}`}>Successfully submitted referral</div>
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
