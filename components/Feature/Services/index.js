import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import Categories from './Categories';
import styles from './index.module.scss';
import { sendDataToAnalytics } from 'lib/utils/analytics';
import { getSearchResults } from 'lib/utils/search';
import { CATEGORY_CATEGORIES, ACTION_CLICK } from 'lib/utils/analyticsConstants';

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
  const [filteredResources, setFilteredResources] = useState(null);

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

  const flattenSearchResults = searchResults => {
    const resources = searchResults.map(category => category.resources).flat();
    const res = [];
    resources.forEach(resource => {
      let index = res.findIndex(x => x.id === resource.id);
      if (index > -1) {
        res[index].description = res[index].description + '. ' + resource.description;
      } else {
        res.push(resource);
      }
    });
    return {
      name: 'Search results',
      resources: res
    };
  };

  const handleSearch = e => {
    e.preventDefault();

    const searchTerm = e.target['search-input'].value;
    const searchResults = getSearchResults(searchTerm, categorisedResources);
    const newFilteredResources = flattenSearchResults(searchResults);
    setFilteredResources(newFilteredResources);
  };

  const clickCategory = e => {
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    const newCategory = e;
    setOpenReferralForm({});
    window.location.href = '#search-results-header';
    sendDataToAnalytics({ action: ACTION_CLICK, category: CATEGORY_CATEGORIES, label: e });
    setFilteredResources(
      categorisedResources[categorisedResources.findIndex(x => x.name === newCategory)]
    );
  };

  return (
    <>
      <h2 id="search-for-support-header" className={`govuk-heading-l`}>
        Search for support
      </h2>
      <form onSubmit={handleSearch}>
        <input
          id="topic-search"
          list="input-tags"
          type="text"
          name="search-input"
          className="govuk-input govuk-input--width-30"
        />
        <button type="submit" className="govuk-button" data-testid="cookies-yes-button">
          Search
        </button>
      </form>
      <h2 id="resources-header" className={`govuk-heading-l`}>
        Explore categories
      </h2>
      <Categories categorisedResources={categorisedResources} clickCategory={clickCategory} />
      <div className="govuk-grid-column-full"></div>
      <div className="govuk-grid-column-full-width">
        <hr
          className={`govuk-section-break govuk-section-break--m govuk-section-break--visible ${styles['horizontal-divider']}`}
        />
        {filteredResources && (
          <div key={`search-result-${filteredResources.id}`}>
            <h2 id="search-results-header">Search results</h2>
            <h2
              data-testid="search-results-header"
              className={`${styles['search-results-header']}`}>
              {filteredResources.name}
            </h2>

            {filteredResources.resources.map(resource => (
              <ResourceCard
                key={`resource-card-${resource.id}-${resource.name}`}
                data-testid={`resource-${resource.id}`}
                {...resource}
                updateSelectedResources={() => {}}
                categoryId={filteredResources.id}
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
          </div>
        )}
      </div>
    </>
  );
};

export default Services;
