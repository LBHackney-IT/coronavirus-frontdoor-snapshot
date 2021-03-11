import css from './index.module.scss';
import SummaryList from 'components/Form/SummaryList';
import { useState } from 'react';

const HIDDEN_TAGS = ['Delivery', 'Collection', 'Food']

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
  ...others
}) => {
  const [widerConversationDetail, setWiderConversationDetail] = useState(null)
  const [validationError, setValidationError] = useState({});
  const [hideForm, setHideForm] = useState(true)

  const trimLength = (s, length) => s.length > length ? s.substring(0, length) + "..." : s

  const selfReferralElement = (selfReferral == 'No') ? 'Referral required' : 'Self referral'
  const websiteElement = websites && websites.length > 0 &&  websites.map(website => (<a href={websites[0]} target="_blank" rel="noopener noreferrer">{websites[0]}</a>))
  const distributionElement =  tags.filter(t => HIDDEN_TAGS.includes(t)).join(", ")
  const tagsElement = tags.filter(t => !HIDDEN_TAGS.includes(t)).map(item=> (<span key={"tags-"+item} className={`${css.tags} tag-element`}>{trimLength(item, 20)}</span>))
  const snapshot = (customerId != undefined) ? true : false
  const summaryDataExists = ( telephone  || distance != 100 || currentProvision || openingTimes)
  const marginClass = (summaryDataExists) ? "" : "remove-margin-bottom"
  const updateResource = () =>{
    updateSelectedResources({
      name:name,
      description: description,
      address:address,
      telephone: telephone,
      email:email,
      referralContact: referralContact,
      selfReferral: selfReferral,
      openingTimes: openingTimes,
      websites:websites,
      notes:notes
    })
  }
  const onInvalidField = (id) => {
    setValidationError({[id]: true, ...validationError})
  }
  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div className={`${css.tags__container} card-header-tag`}>
        {tagsElement}
      </div>
       <h3 className={marginClass}>{name}</h3>
        <>
        <SummaryList key={`resourceInfo-${id}-${categoryId}`} name={['resourceInfo']} entries={{ 'Distance': (distance && distance < 100) ? distance + ' miles' : null ,
      'Availability': currentProvision, 'Days / Times' : openingTimes, 'Distribution' : distributionElement, 'Telephone' : telephone, 'Service Description': serviceDescription}} customStyle="small" />

        </>
        <details className="govuk-details" data-module="govuk-details">
        <summary id ={`summary-${id}`} type="submit" form="resident-details" onClick={() => {setHideForm(!hideForm)} } >Refer</summary>
          {hideForm ? '' :
          <div hidden={hideForm}>
            <div
              className={`govuk-form-group govuk-!-padding-bottom-2 ${
                validationError[`referral-reason-${name}`]? 'govuk-form-group--error' : ''
              }`}
            >
              <legend className="govuk-fieldset__legend">
                Reason for referral, please give as much detail as possible
              </legend>

              {validationError[`referral-reason-${name}`] && (
                <span
                  id="more-detail-error"
                  className={` ${validationError[`referral-reason-${name}`] ? 'govuk-error-message' : ''}`}
                >
                  <span className="govuk-visually-hidden">Error:</span> Enter
                  more detail
                </span>
              )}
              <textarea
                form="resident-details"
                className={`govuk-textarea ${
                  validationError[`referral-reason-${name}`] ? 'govuk-form-group--error' : ''
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
                validationError[`conversation-notes-${name}`] ? 'govuk-form-group--error' : ''
              }`}
            >
              <legend className="govuk-fieldset__legend">
              Notes on wider conversation(other needs, living situation, key information
              </legend>
              {validationError[`conversation-notes-${name}`] && (
                <span
                  id="more-detail-error"
                  className={` ${
                    validationError[`conversation-notes-${name}`] ? 'govuk-error-message' : ''
                  }`}
                >
                  <span className="govuk-visually-hidden">Error:</span> Enter
                  more detail
                </span>
              )}
              <textarea
                form="resident-details"
                className={`govuk-textarea ${
                  validationError[`conversation-notes-${name}`] ? 'govuk-form-group--error' : ''
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
            <div className="govuk-form-group govuk-!-padding-bottom-2">
              <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
                <legend className="govuk-fieldset__legend">
                  How would you like to be recieve the information?
                </legend>
                <div id="waste-hint" className="govuk-hint">
                  Select all that apply.
                </div>
                <div className="govuk-checkboxes govuk-!-padding-bottom-9">
                  <div className="govuk-checkboxes__item">
                    <input
                      className="govuk-checkboxes__input"
                      id="waste"
                      name="waste"
                      type="checkbox"
                      value="carcasses"
                    />
                    <label
                      className="govuk-label govuk-checkboxes__label"
                      for="waste"
                    >
                      Email details of the service to the resident
                    </label>
                  </div>
                  <div className="govuk-checkboxes__item">
                    <input
                      className="govuk-checkboxes__input"
                      id="waste-2"
                      name="waste"
                      type="checkbox"
                      value="mines"
                    />
                    <label
                      className="govuk-label govuk-checkboxes__label"
                      for="waste-2"
                    >
                      Text details of the service to the resident
                    </label>
                  </div>
                </div>
                <div className="govuk-!-margin-top-2">
                <input
                  type="submit"
                  className="govuk-button"
                  name="Submit"
                  form="resident-details"
                />
                </div>
              </fieldset>
            </div>
          </div>
        }
      </details>
      <details className="govuk-details" data-module="govuk-details">
        <summary id ={`summary-${id}`} className="">View more information</summary>

        <SummaryList key={`moreResourceInfo-${id}-${categoryId}`} name={'moreResourceInfo'} entries={{ 'How to contact': selfReferralElement,
      'Address': address, 'Description' : description, 'Website' : websiteElement, 'Additional notes' : notes }} customStyle="small" />
        { snapshot &&
      (
        <div className="govuk-checkboxes__item">
          <input className="govuk-checkboxes__input" id={`input-${id}`} onClick={() => updateResource()} type="checkbox" value={name}/>
          <label className="govuk-label govuk-checkboxes__label" id={`label-${id}`}>
            Would you like to recommend this resource?
          </label>
        </div>)
      }
      </details>
    </div>
  );
};

export default ResourceCard;
