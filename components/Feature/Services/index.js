import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import Categories from './Categories';
import styles from './index.module.scss';

const Services = ({
  categorisedResources,
  residentFormCallback,
  referralCompletion,
  setReferralCompletion,
  updateSignpostSummary,
  referrerData,
  setReferrerData
}) => {
  const [openReferralForm, setOpenReferralForm] = useState({});
  const [referralData, setReferralData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const detailsClicked = (e, id, serviceId, categoryName) => {
    e.preventDefault();
    const isOpen = document.getElementById(id).getAttribute('open');
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    if (!isOpen) {
      document.getElementById(id).setAttribute('open', true);
      setOpenReferralForm({ id: serviceId, categoryName });
      residentFormCallback(true);
    } else {
      setOpenReferralForm({});
      residentFormCallback(false);
    }
  };

  const clickCategory = e => {
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    setOpenReferralForm({});
    setSelectedCategory(e);
    window.location.href = '#search-results-header';
  };
  return (
    <>
      <h2 id="resources-header" className={`govuk-heading-l`}>
        Explore categories
      </h2>
      <Categories categorisedResources={categorisedResources} clickCategory={clickCategory} />
      <div className="govuk-grid-column-full"></div>
      <div className="govuk-grid-column-full-width">
        <hr
          className={`govuk-section-break govuk-section-break--m govuk-section-break--visible ${styles['horizontal-divider']}`}
        />
        {categorisedResources
          .filter(x => x.name == selectedCategory)
          .map(taxonomy => {
            return (
              <>
                <h2 id="search-results-header">Search results</h2>
                <h2
                  data-testid="search-results-header"
                  className={`${styles['search-results-header']}`}>
                  {selectedCategory}
                </h2>
                {taxonomy.resources.map(resource => (
                  <ResourceCard
                    key={`resource-card-${resource.id}-${resource.name}`}
                    data-testid={`resource-${resource.id}`}
                    {...resource}
                    updateSelectedResources={() => {}}
                    categoryId={taxonomy.id}
                    referralCompletion={referralCompletion}
                    setReferralCompletion={setReferralCompletion}
                    detailsClicked={detailsClicked}
                    openReferralForm={openReferralForm}
                    referralData={referralData}
                    setReferralData={setReferralData}
                    referrerData={referrerData}
                    setReferrerData={setReferrerData}
                    updateSignpostSummary={updateSignpostSummary}
                  />
                ))}
              </>
            );
          })}
      </div>
    </>
  );
};

export default Services;
