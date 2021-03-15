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
  categoryId,
  ...others
}) => {
  const trimLength = (s, length) => s.length > length ? s.substring(0, length) + "..." : s

  const selfReferralElement = (selfReferral == 'No') ? 'Referral required' : 'Self referral'
  const websiteElement = websites && websites.length > 0 &&  websites.map(website => (<div><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></div>))
  const distributionElement =  tags.filter(t => HIDDEN_TAGS.includes(t)).join(", ")
  const tagsElement = tags.filter(t => !HIDDEN_TAGS.includes(t)).map(item=> (<span key={"tags-"+item} className={`${css.tags} tag-element ${css[`${item}-tag`]}`}>{trimLength(item, 20)}</span>))
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
  
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  const copyToClipboard = () => {
    var copyText = document.getElementById(`resource-${name}`);
    // copyText.type = 'text';
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setCopiedToClipboard(true)
    // copyText.type = 'hidden';
  }
  
  const clipboardServiceDetails = 
  "Service Name: " + name + 
      "\nTelephone: " + telephone + 
      "\nService Description: " + serviceDescription + 
      "\nAddress: " + address + 
      "\nDescription: " + description + 
      "\nWebsites: " + JSON.stringify(websites).replace("[", "").replace("]", "") 

  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div className={`${css.tags__container} card-header-tag`} data-testid='resource-card-tags'>
        {tagsElement}
      </div>
      <textarea id={`resource-${name}`} type="text" value={clipboardServiceDetails}/>
      <div>
      <a onClick={() => copyToClipboard()}>{!copiedToClipboard && <span> Copy service details</span>} {copiedToClipboard && <span> Copied to clipboard</span>}
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg></a>
    </div>
      <h3 className={marginClass}>{name}</h3>
        <>
        <SummaryList key={`resourceInfo-${id}-${categoryId}`} name={['resourceInfo']} entries={{ 'Distance': (distance && distance < 100) ? distance + ' miles' : null ,
      'Availability': currentProvision, 'Days / Times' : openingTimes, 'Distribution' : distributionElement, 'Telephone' : telephone, 'Service Description': serviceDescription}} customStyle="small" />

        </>
      
      <details className="govuk-details" data-module="govuk-details">
        <summary id ={`summary-${id}`} className="">View more information</summary>

        <SummaryList key={`moreResourceInfo-${id}-${categoryId}`} name={'moreResourceInfo'} entries={{ 'How to contact': selfReferralElement,
      'Address': address, 'Description' : description, 'Website' : websiteElement, 'Additional notes' : notes, 
      'Referral email': referralContact, 'Referral Website': referralWebsite }} customStyle="small" />
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
