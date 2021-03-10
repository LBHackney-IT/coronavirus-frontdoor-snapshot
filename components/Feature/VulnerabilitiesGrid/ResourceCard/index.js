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
  const [referralDetail, setReferralDetail] = useState(null)
  const [widerConversationDetail, setWiderConversationDetail] = useState(null)
  const [consentGiven, setConsentGiven] = useState(null)
  const [renderForm, setRenderForm] = useState(false)

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
  const renderFormFunction = () => {
    setRenderForm(!renderForm)
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
        <summary id ={`summary-${id}`} type="submit" form="resident-details" onClick={renderFormFunction} >Refer</summary>
        {
          renderForm && 
          <div>
            <div className={`govuk-form-group  ${!referralDetail ? 'govuk-form-group--error' : ''}`}>
              <div id="more-detail-hint" className="govuk-hint">Reason for referral, please give as much detail as possible</div>
              { !referralDetail &&
                <span id="more-detail-error"  className={` ${!referralDetail ? 'govuk-error-message' : ''}`}>
                  <span className="govuk-visually-hidden">Error:</span> Enter more detail
                </span>
              }
              <textarea form="resident-details" className={`govuk-textarea ${!referralDetail ? 'govuk-form-group--error' : ''}`} id="more-details-referral" name="resident-details-referral" rows="5" aria-describedby="more-detail-hint more-detail-error" onChange={(e)=>setReferralDetail(e.target.value)}></textarea>
          </div>
          <div className={`govuk-form-group  ${!widerConversationDetail ? 'govuk-form-group--error' : ''}`}>
              <div id="more-detail-hint" className="govuk-hint">Notes on wider conversation(other needs, living situation, key information</div>
              { !widerConversationDetail &&
                <span id="more-detail-error"  className={` ${!widerConversationDetail ? 'govuk-error-message' : ''}`}>
                  <span className="govuk-visually-hidden">Error:</span> Enter more detail
                </span>
              }
              <textarea form="resident-details" className={`govuk-textarea ${!widerConversationDetail ? 'govuk-form-group--error' : ''}`} id="more-details-conversation" name="more-details-conversation" rows="5" aria-describedby="more-detail-hint more-detail-error" onChange={(e)=>setWiderConversationDetail(e.target.value)}></textarea>
          </div>
          <div class="govuk-form-group">
            <fieldset class="govuk-fieldset" aria-describedby="changed-name-hint">
              <legend class="govuk-fieldset__legend">
              Does the resident consent to sharing third party information?
              </legend>
              <div class="govuk-radios govuk-radios--inline">
                <div class="govuk-radios__item">
                  <input class="govuk-radios__input" id="changed-name" name="changed-name" type="radio" value="true" onClick={(e)=>{setConsentGiven(e.target.value)}}/>
                  <label class="govuk-label govuk-radios__label" for="changed-name">
                    Yes
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div class="govuk-form-group">
            <fieldset class="govuk-fieldset" aria-describedby="waste-hint">
              <legend class="govuk-fieldset__legend">
                  How would you like to be recieve the information?
              </legend>
              <div id="waste-hint" class="govuk-hint">
                Select all that apply.
              </div>
              <div class="govuk-checkboxes">
                <div class="govuk-checkboxes__item">
                  <input class="govuk-checkboxes__input" id="waste" name="waste" type="checkbox" value="carcasses"/>
                  <label class="govuk-label govuk-checkboxes__label" for="waste">
                  Email details of the service to Joni Mitchell
                  </label>
                </div>
                <div class="govuk-checkboxes__item">
                  <input class="govuk-checkboxes__input" id="waste-2" name="waste" type="checkbox" value="mines"/>
                  <label class="govuk-label govuk-checkboxes__label" for="waste-2">
                  Text details of the service to Joni Mitchell
                  </label>
                </div>
              </div>
              <input type="submit" className="govuk-button" name="Submit" form="resident-details"/> 
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
