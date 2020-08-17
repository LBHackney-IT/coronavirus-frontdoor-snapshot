import css from './index.module.scss';
import SummaryList from 'components/Form/SummaryList';

const HIDDEN_TAGS = ['Delivery', 'Collection', 'Food'] 

const ResourceCard = ({
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


  return (
    <div className={`${css.resource}`} {...others}>
      <div className={css.tags__container}>
        {tagsElement}
      </div>
      <h3>{name}</h3>
        <>
        <SummaryList key="resourceInfo" name={['resourceInfo']} entries={{ 'Distance': (distance && distance < 100) ? distance + ' miles' : null ,
      'Availability': currentProvision, 'Days / Times' : openingTimes, 'Distribution' : distributionElement, 'Telephone' : telephone}} customStyle="small" />

        </>
      
      <details className="govuk-details" data-module="govuk-details">
        <summary className="">View more information</summary>

        <SummaryList key="moreResourceInfo" name={'moreResourceInfo'} entries={{ 'How to contact': selfReferralElement,
      'Address': address, 'Description' : description, 'Website' : websiteElement, 'Additional notes' : notes }} customStyle="small" />

      </details>
    </div>
  );
};

export default ResourceCard;
