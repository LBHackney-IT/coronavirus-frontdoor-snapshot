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
  selfReferral,
  notes,
  distance,
  matches,
  ...others
}) => {
  const trimLength = (s, length) => s.length > length ? s.substring(0, length) + "..." : s

  const selfReferralElement = (selfReferral == 'No') ? 'Referral required' : 'Self referral'
  const websiteElement = websites && websites.length > 0 &&  websites.map(website => (<a href={websites[0]} target="_blank" rel="noopener noreferrer">{websites[0]}</a>))
  const distributionElement =  tags.filter(t => HIDDEN_TAGS.includes(t)).join(", ")
  const tagsElement = tags.filter(t => !HIDDEN_TAGS.includes(t)).map(item=> (<span key={"tags-"+item} className={css.tags}>{trimLength(item, 20)}</span>))
  const  [addToResourceSummary, setAdddToResourceSummary] = useState(false)
  let [buttonText, setButtonText] = useState('Add')

  const updateResource = () =>{
    let updatedAddToResourceSummary =!addToResourceSummary
    setAdddToResourceSummary(updatedAddToResourceSummary)
    let updatedButtonText = (addToResourceSummary)? 'Add' : 'Remove'
    setButtonText(updatedButtonText)
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

  return (
    <div className={`resource ${css.resource}`} {...others}>
      <div className={css.tags__container}>
        {tagsElement}
      </div>
      <h3>{name}</h3>
        <>
        <SummaryList key="resourceInfo" name={['resourceInfo']} entries={{ 'Distance': (distance && distance < 100) ? distance + ' miles' : null ,
      'Availability': currentProvision, 'Days / Times' : openingTimes, 'Distribution' : distributionElement, 'Telephone' : telephone}} customStyle="small" />

        </>
      
      <details className="govuk-details" data-module="govuk-details">
        <summary id ={`summary-${id}`} className="">View more information</summary>

        <SummaryList key="moreResourceInfo" name={'moreResourceInfo'} entries={{ 'How to contact': selfReferralElement,
      'Address': address, 'Description' : description, 'Website' : websiteElement, 'Additional notes' : notes }} customStyle="small" />

      <button onClick={() => updateResource()} id={`button-${id}`} class="govuk-button" data-module="govuk-button">{buttonText}</button>
      </details>
    </div>
  );
};

export default ResourceCard;
