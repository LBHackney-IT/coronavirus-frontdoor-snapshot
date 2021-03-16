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
  openingTimes,
  currentProvision,
  email,
  referralContact,
  referralWebsite,
  selfReferral,
  notes,
  distance,
  matches,
  customerId,
  categoryName,
  serviceDescription,
  residentInfo,
  categoryId,
  refererInfo,
  ...others
}) => {
  const [validationError, setValidationError] = useState({});
  const [hideForm, setHideForm] = useState(true);
  const [referrerData, setReferrerData] = useState({
    name: refererInfo?.name,
    email: refererInfo?.email,
    organisation: refererInfo?.iss
  });
  const [referralMade, setReferralMade] = useState({});
  const trimLength = (s, length) =>
    s.length > length ? s.substring(0, length) + '...' : s;

  const selfReferralElement =
    selfReferral == 'No' ? 'Referral required' : 'Self referral';
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
  const distributionElement = tags
    .filter(t => HIDDEN_TAGS.includes(t))
    .join(', ');
  const tagsElement = tags
    .filter(t => !HIDDEN_TAGS.includes(t))
    .map(item => (
      <span
        key={'tags-' + item}
        className={`${css.tags} tag-element ${css[`${item}-tag`]}`}
      >
        {trimLength(item, 20)}
      </span>
    ));
  const snapshot = customerId != undefined ? true : false;
  const summaryDataExists =
    telephone || distance != 100 || currentProvision || openingTimes;
  const marginClass = summaryDataExists ? '' : 'remove-margin-bottom';
  const updateResource = () => {
    updateSelectedResources({
      name: name,
      description: description,
      address: address,
      telephone: telephone,
      email: email,
      referralContact: referralContact,
      selfReferral: selfReferral,
      openingTimes: openingTimes,
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

  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div
        className={`${css.tags__container} card-header-tag`}
        data-testid="resource-card-tags"
      >
        {tagsElement}
      </div>
      <h3 className={marginClass}>{name}</h3>
      <>
        <SummaryList
          key={`resourceInfo-${id}-${categoryId}`}
          name={['resourceInfo']}
          entries={{
            Distance: distance && distance < 100 ? distance + ' miles' : null,
            Availability: currentProvision,
            'Days / Times': openingTimes,
            Distribution: distributionElement,
            Telephone: telephone,
            'Service Description': serviceDescription
          }}
          customStyle="small"
        />
      </>
      <details className="govuk-details" data-module="govuk-details">
        <summary
          id={`summary-${id}`}
          type="submit"
          form="resident-details"
          onClick={() => {
            setHideForm(!hideForm);
          }}
        >
          Refer
        </summary>
        {hideForm ? (
          ''
        ) : (
          <div hidden={hideForm}>
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`referral-reason-${name}`]
                  ? 'govuk-form-group--error'
                  : ''
              }`}
            >
              <legend className="govuk-fieldset__legend">
                Reason for referral, please give as much detail as possible
              </legend>

              {validationError[`referral-reason-${name}`] && (
                <span
                  id="more-detail-error"
                  className={` ${
                    validationError[`referral-reason-${name}`]
                      ? 'govuk-error-message'
                      : ''
                  }`}
                >
                  <span className="govuk-visually-hidden">Error:</span> Enter
                  more detail
                </span>
              )}
              <textarea
                form="resident-details"
                className={`govuk-textarea ${
                  validationError[`referral-reason-${name}`]
                    ? 'govuk-input--error'
                    : ''
                }`}
                id={`referral-reason-${name}`}
                name="referral-reason"
                rows="5"
                aria-describedby="more-detail-hint more-detail-error"
                required
                onInvalid={e => onInvalidField(e.target.id)}
              ></textarea>
            </div>
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`conversation-notes-${name}`]
                  ? 'govuk-form-group--error'
                  : ''
              }`}
            >
              <legend className="govuk-fieldset__legend">
                Notes on wider conversation(other needs, living situation, key
                information
              </legend>
              {validationError[`conversation-notes-${name}`] && (
                <span
                  id="more-detail-error"
                  className={` ${
                    validationError[`conversation-notes-${name}`]
                      ? 'govuk-error-message'
                      : ''
                  }`}
                >
                  <span className="govuk-visually-hidden">Error:</span> Enter
                  more detail
                </span>
              )}
              <textarea
                form="resident-details"
                className={`govuk-textarea ${
                  validationError[`conversation-notes-${name}`]
                    ? 'govuk-input--error'
                    : ''
                }`}
                id={`conversation-notes-${name}`}
                name="conversation-notes"
                rows="5"
                aria-describedby="more-detail-hint more-detail-error"
                required
                onInvalid={e => onInvalidField(e.target.id)}
              ></textarea>
            </div>
            <div className="govuk-form-group govuk-!-padding-bottom-2">
              <fieldset
                className="govuk-fieldset"
                aria-describedby="changed-name-hint"
              >
                <legend className="govuk-fieldset__legend">
                  Does the resident consent to sharing third party information?
                </legend>
                <div className="govuk-checkboxes govuk-checkboxes--inline">
                  <div className="govuk-checkboxes__item">
                    <input
                      form="resident-details"
                      className="govuk-checkboxes__input"
                      id="changed-name"
                      name="changed-name"
                      type="checkbox"
                      value="true"
                    />
                    <label
                      className="govuk-label govuk-checkboxes__label"
                      for="changed-name"
                    >
                      Yes
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div>
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 ${
                  validationError[`referer-name-${name}`]
                    ? 'govuk-form-group--error'
                    : ''
                }`}
              >
                <label className="govuk-label inline" htmlFor="name">
                  Your name
                </label>
                <span
                  id="name-error"
                  className="govuk-error-message"
                  aria-describedby="input-name-error"
                >
                  <span
                    hidden={!validationError[`referer-name-${name}`]}
                    data-testid="name-error"
                  >
                    Enter your name
                  </span>
                </span>
                <input
                  form="resident-details"
                  className={`govuk-input govuk-!-width-two-thirds ${
                    validationError[`referer-name-${name}`]
                      ? 'govuk-input--error'
                      : ''
                  }`}
                  id={`referer-name-${name}`}
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
                  validationError[`referer-organistion-${name}`]
                    ? 'govuk-form-group--error'
                    : ''
                }`}
              >
                <label className="govuk-label inline" htmlFor="name">
                  Your organisation
                </label>
                <span
                  id="name-error"
                  className="govuk-error-message"
                  aria-describedby="input-name-error"
                >
                  <span
                    hidden={!validationError[`referer-organistion-${name}`]}
                    data-testid="name-error"
                  >
                    Enter your organisation
                  </span>
                </span>
                <input
                  form="resident-details"
                  className={`govuk-input govuk-!-width-two-thirds ${
                    validationError[`referer-organistion-${name}`]
                      ? 'govuk-input--error'
                      : ''
                  }`}
                  id={`referer-organistion-${name}`}
                  name="referer-organisation"
                  type="text"
                  onChange={e => {
                    const newOrganisationVal = e.target.value;
                    setReferrerData({
                      ...referrerData,
                      organisation: newOrganisationVal
                    });
                  }}
                  aria-describedby="refererOrganistion-hint"
                  aria-describedby="refererOrganistion"
                  onInvalid={e => onInvalidField(e.target.id)}
                  value={referrerData?.organisation} //we probably dont want this, im not sure if exrternal users will have iss set for them as their own org
                  required
                />
              </div>
              <div
                className={`govuk-form-group govuk-!-padding-bottom-2 ${
                  validationError[`referer-email-${name}`]
                    ? 'govuk-form-group--error'
                    : ''
                }`}
              >
                <label className="govuk-label inline" htmlFor="name">
                  Your email
                </label>
                <span
                  id="name-error"
                  className="govuk-error-message"
                  aria-describedby="input-name-error"
                >
                  <span
                    hidden={!validationError[`referer-email-${name}`]}
                    data-testid="name-error"
                  >
                    Enter your email
                  </span>
                </span>
                <input
                  form="resident-details"
                  className={`govuk-input govuk-!-width-two-thirds ${
                    validationError[`referer-email-${name}`]
                      ? 'govuk-input--error'
                      : ''
                  }`}
                  id={`referer-email-${name}`}
                  name="referer-email"
                  type="email"
                  onChange={e => {
                    const newEmailVal = e.target.value;
                    setReferrerData({ ...referrerData, email: newEmailVal });
                  }}
                  value={referrerData?.email}
                  aria-describedby="refererOrganistion-hint"
                  aria-describedby="refererOrganistion"
                  onInvalid={e => onInvalidField(e.target.id)}
                  required
                />
              </div>
            </div>
            <div className="govuk-form-group govuk-!-padding-bottom-2">
              <div className="govuk-!-margin-top-4">
                <input
                  type="submit"
                  className="govuk-button"
                  name="Submit"
                  form="resident-details"
                />
              </div>
            </div>
          </div>
        )}
      </details>
      <details className="govuk-details" data-module="govuk-details">
        <summary id={`summary-${id}`} className="">
          View more information
        </summary>

        <SummaryList
          key={`moreResourceInfo-${id}-${categoryId}`}
          name={'moreResourceInfo'}
          entries={{
            'How to contact': selfReferralElement,
            Address: address,
            Description: description,
            Website: websiteElement,
            'Additional notes': notes
          }}
          customStyle="small"
        />
        {snapshot && (
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id={`input-${id}`}
              onClick={() => updateResource()}
              type="checkbox"
              value={name}
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              id={`label-${id}`}
            >
              Would you like to recommend this resource?
            </label>
          </div>
        )}
      </details>
    </div>
  );
};

export default ResourceCard;
