import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import Categories from './Categories';
import Details from 'components/Form/Details';
import styles from './index.module.scss';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import { getSearchResults } from 'lib/utils/search';
import {
  CATEGORY_CATEGORIES,
  CATEGORY_SEARCH,
  FEEDBACK_SEARCH
} from 'lib/utils/analyticsConstants';

const Services = ({
  categorisedResources,
  referralCompletion,
  setReferralCompletion,
  updateSignpostSummary,
  referrerData,
  setReferrerData,
  signpostSummary,
  setResidentInfo,
  token,
  referralSummary,
  setReferralSummary,
  updateEmailBody,
  setEmailBody,
  residentInfo,
  setPreserveFormData,
  preserveFormData
}) => {
  const [openReferralForm, setOpenReferralForm] = useState({});
  const [referralData, setReferralData] = useState({});
  const [filteredResources, setFilteredResources] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const detailsClicked = (e, id, serviceId, categoryName) => {
    e.preventDefault();
    const isOpen = document.getElementById(id).getAttribute('open');
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    if (!isOpen) {
      document.getElementById(id).setAttribute('open', true);
      setOpenReferralForm({ id: serviceId, categoryName });
    } else {
      setOpenReferralForm({});
    }
  };

  const sendFeedback = () => {
    let enteredText = document.getElementById('search-feedback').value;
    if (enteredText?.length > 0) {
      sendDataToAnalytics({
        action: getUserGroup(referrerData['user-groups']),
        category: FEEDBACK_SEARCH,
        label: document.getElementById('keyword-search').value,
        value: filteredResources?.resources?.length,
        custom_text: enteredText
      });
      setFeedbackSubmitted(true);
    }
  };

  const flattenSearchResults = searchResults => {
    const resources = searchResults.map(category => category.resources).flat();
    let res = [];
    resources.forEach(resource => {
      let index = res.findIndex(x => x.id === resource.id);
      if (index > -1) {
        res[index].description = [res[index].description, resource.description]
          .filter(x => x?.trim())
          .map(x => x.trim())
          .join('. ');
      } else {
        res.push(resource);
      }
    });
    return {
      name: `${res.length} ${res.length == 1 ? 'result' : 'results'}`,
      resources: res
    };
  };

  const handleSearch = e => {
    e.preventDefault();
    setFeedbackSubmitted(false);

    const searchTerm = e.target['search-input'].value;
    const searchResults = getSearchResults(searchTerm, categorisedResources);
    const newFilteredResources = flattenSearchResults(searchResults);

    newFilteredResources.resources.sort((a, b) => b.weight - a.weight);

    setFilteredResources(newFilteredResources);
    sendDataToAnalytics({
      action: getUserGroup(referrerData['user-groups']),
      category: CATEGORY_SEARCH,
      label: searchTerm,
      value: newFilteredResources.resources.length
    });
    window.location.href = '#search-results-divider';
  };
  const clickCategory = e => {
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    setOpenReferralForm({});
    setFeedbackSubmitted(false);
    window.location.href = '#search-results-divider';
    sendDataToAnalytics({
      action: getUserGroup(referrerData['user-groups']),
      category: CATEGORY_CATEGORIES,
      label: e
    });
    setFilteredResources(categorisedResources[categorisedResources.findIndex(x => x.name === e)]);
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <label
          htmlFor="keyword-search"
          id="search-for-support-header"
          className={`govuk-heading-l`}>
          Search for support
        </label>
        <input
          id="keyword-search"
          data-testid="keyword-search"
          list="input-tags"
          type="search"
          name="search-input"
          placeholder="Type here what you are looking for..."
          className="govuk-input govuk-input--width-30"
        />
        <button
          type="submit"
          className="govuk-button govuk-!-margin-left-2"
          data-testid="keyword-search-button">
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
          id="search-results-divider"
          className={`govuk-section-break govuk-section-break--m govuk-section-break--visible ${styles['horizontal-divider']}`}
        />
        {filteredResources && (
          <div key={`search-result-${filteredResources.id}`} data-testid="search-results-container">
            <h2 id="search-results-header">Search results</h2>
            <h2
              data-testid="search-results-header"
              className={`${styles['search-results-header']}`}>
              {filteredResources.name}
            </h2>

            <div className="govuk-!-margin-bottom-6">
              <p>
                If the results don't contain a service or information you require, please let us
                know.
              </p>
              {!feedbackSubmitted ? (
                <Details id="feedback-summary" title="Provide feedback">
                  <div className="govuk-inset-text">
                    <textarea
                      id="search-feedback"
                      maxLength="450"
                      className={styles['feedback-textarea']}
                    />
                    <br />
                    <button onClick={sendFeedback} className={`govuk-button`}>
                      Send
                    </button>
                  </div>
                </Details>
              ) : (
                <div className={styles['success-message']}>
                  Feedback submitted. Thank you for providing us with information to assist in
                  improving this tool.
                </div>
              )}
            </div>

            {filteredResources.resources.map(resource => (
              <ResourceCard
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
                signpostSummary={signpostSummary}
                setResidentInfo={setResidentInfo}
                token={token}
                referralSummary={referralSummary}
                setReferralSummary={setReferralSummary}
                updateEmailBody={updateEmailBody}
                setEmailBody={setEmailBody}
                residentInfo={residentInfo}
                setPreserveFormData={setPreserveFormData}
                preserveFormData={preserveFormData}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Services;
