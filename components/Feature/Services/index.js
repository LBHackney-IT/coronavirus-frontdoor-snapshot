import { useState } from 'react';
import ResourceCard from 'components/Feature/ResourceCard';
import Categories from './Categories';
import Details from 'components/Form/Details';
import SpecificNeeds from './SpecificNeeds';
import styles from './index.module.scss';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import { getWordsToHighlight, getSpecificNeedsWords, getSearchResult } from 'lib/utils/search';
import { CATEGORY_SEARCH, FEEDBACK_SEARCH, SHOW_MORE_RESULTS } from 'lib/utils/constants';

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
  const [resultsTitle, setResultsTitle] = useState(null);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSpecificNeeds, setSelectedSpecificNeeds] = useState([]);
  const [showMoreResults, setShowMoreResults] = useState(false);

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

  const sendFeedback = e => {
    let enteredText = e.target['search-feedback'].value;
    if (enteredText?.length > 0) {
      sendDataToAnalytics({
        action: getUserGroup(referrerData['user-groups']),
        category: FEEDBACK_SEARCH,
        label: resultsTitle,
        value: filteredResources?.resources?.length,
        custom_text: enteredText
      });
      setFeedbackSubmitted(true);
    }
  };

  const showAllClicked = e => {
    setShowMoreResults(!showMoreResults);
    sendDataToAnalytics({
      action: getUserGroup(referrerData['user-groups']),
      category: SHOW_MORE_RESULTS,
      label: resultsTitle,
      value: filteredResources.resources.length,
      custom_text: selectedCategories.join('|')
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    setFeedbackSubmitted(false);
    setShowMoreResults(false);

    const searchTerm = e.target['search-input'].value;
    setResultsTitle(searchTerm);

    const newFilteredResources = getSearchResult({
      categorisedResources,
      searchTerm,
      selectedCategories,
      selectedSpecificNeeds
    });

    const specificNeedsWords = getSpecificNeedsWords(selectedSpecificNeeds);

    setFilteredResources(newFilteredResources);
    sendDataToAnalytics({
      action: getUserGroup(referrerData['user-groups']),
      category: CATEGORY_SEARCH,
      label: searchTerm,
      value: newFilteredResources.resources.length,
      custom_text: selectedCategories.join('|')
    });

    const toHighlight = searchTerm
      ? getWordsToHighlight(searchTerm)
      : selectedCategories.length > 0
      ? selectedCategories.map(x => getWordsToHighlight(x)).flat()
      : specificNeedsWords.map(x => getWordsToHighlight(x)).flat();
    setWordsToHighlight(toHighlight);
    window.location.href = '#search-results-divider';
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <form onSubmit={handleSearch}>
            <div className="govuk-grid-row">
              <h2 className={`govuk-heading-l`}>Personalise</h2>
              <p>All fields are optional.</p>
            </div>
            <div className={`${styles['personalise-panel']} govuk-grid-row `}>
              <div className="govuk-!-margin-bottom-6">
                <h2 className={`govuk-heading-m`}>Problems faced</h2>

                <Categories
                  categorisedResources={categorisedResources}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>
              <div className="govuk-!-margin-bottom-6">
                <h2 className={`govuk-heading-m`}>Select all that apply</h2>

                <SpecificNeeds
                  selectedSpecificNeeds={selectedSpecificNeeds}
                  setSelectedSpecificNeeds={setSelectedSpecificNeeds}
                />
              </div>
              <div className="govuk-!-margin-bottom-6">
                <h3 className={`govuk-heading-m`}>Additional needs</h3>
                <label htmlFor="keyword-search">
                  Enter keywords for further needs the resident may have.
                </label>
                <input
                  id="keyword-search"
                  data-testid="keyword-search"
                  list="input-tags"
                  type="search"
                  name="search-input"
                  placeholder="e.g. autism, disabilities"
                  className="govuk-input govuk-input--width-30"
                />
              </div>
              <div>
                <button type="submit" className="govuk-button" data-testid="keyword-search-button">
                  Suggest services
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="govuk-grid-column-three-quarters">
          <h2 className={`govuk-heading-l`}>Suggested services</h2>
          {filteredResources ? (
            <>
              {filteredResources.resources.length == 0 ? (
                <p data-testid="results-text">
                  Your search returned no results. If you were looking for a specific service please
                  provide feedback using the form.
                </p>
              ) : (
                <p data-testid="results-text">
                  If the results don't contain a service or information you require, please let us
                  know.
                </p>
              )}
            </>
          ) : (
            <p>
              Use the personalisation options to find services relevant to the needs and situation
              of the resident.
            </p>
          )}
          <hr
            id="search-results-divider"
            className={`govuk-section-break govuk-section-break--m govuk-section-break--hidden`}
          />
          {filteredResources && (
            <div
              key={`search-result-${filteredResources.id}`}
              data-testid="search-results-container">
              <div className="govuk-!-margin-bottom-6">
                {!feedbackSubmitted ? (
                  <Details id="feedback-summary" title="Provide feedback">
                    <form id="search-feedback-form" onSubmit={sendFeedback}>
                      <div className="govuk-inset-text">
                        <div>
                          <label htmlFor="search-feedback">Search results feedback</label>
                        </div>
                        <textarea
                          id="search-feedback"
                          name="search-feedback"
                          maxLength="450"
                          className={styles['feedback-textarea']}
                        />
                        <br />
                        <button type="submit" className={`govuk-button`}>
                          Send
                        </button>
                      </div>
                    </form>
                  </Details>
                ) : (
                  <div className={styles['success-message']}>
                    Feedback submitted. Thank you for providing us with information to assist in
                    improving this tool.
                  </div>
                )}
              </div>

              {filteredResources.resources.slice(0, 8).map((resource, index) => (
                <ResourceCard
                  data-testid={`resource-${resource.id}`}
                  resource={resource}
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
                  wordsToHighlight={wordsToHighlight}
                  index={index}
                />
              ))}
              {showMoreResults && (
                <div id="show-more-container">
                  {filteredResources.resources.slice(8).map((resource, index) => (
                    <ResourceCard
                      data-testid={`resource-${resource.id}`}
                      resource={resource}
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
                      wordsToHighlight={wordsToHighlight}
                      index={index + 8}
                    />
                  ))}
                </div>
              )}
              {filteredResources.resources.length > 8 && (
                <div className={`govuk-grid-row`}>
                  <button
                    type="button"
                    className="govuk-button"
                    data-testid="show-more-button"
                    onClick={showAllClicked}>
                    {!showMoreResults
                      ? `Show all (${filteredResources.resources.length - 8})`
                      : 'Show less'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
