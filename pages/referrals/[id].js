import { useState, useEffect } from 'react';
import useReferral from 'lib/api/utils/useReferral';
import { requestReferral, requestResources, requestPrompts } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { Button, TextArea } from 'components/Form';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import { convertIsoDateToString, convertIsoDateToYears } from 'lib/utils/date';
import geoCoordinates from 'lib/api/utils/geoCoordinates';
import TopicExplorer from 'components/Feature/TopicExplorer';

const ReferralSummary = ({
  resources,
  initialReferral,
  token,
  topics,
  showTopicExplorer
}) => {
  const { referral, loading, updateReferral } = useReferral(
    initialReferral.referralId,
    {
      initialReferral,
      token
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  const [editReferral, setEditReferral] = useState(
    referral.assets.length === 0 &&
      referral.vulnerabilities.length === 0 &&
      !referral.notes
  );
  const [hasValue, setHasValue] = useState(false);

  const updateSelected = selected => {
    referral.assets = selected.assets;
    referral.vulnerabilities = selected.vulnerabilities;
    setHasValue(
      referral.assets.length > 0 ||
        referral.vulnerabilities.length > 0 ||
        referral.notes
    );
  };
  const [selectedResources, setResources] = useState([]);

  const updateSummaryResource = updatedResource => {
    let updatedResources = selectedResources;
    if (
      updatedResources.some(resource => resource.name === updatedResource.name)
    ) {
      let resourcesRemoved = [];
      updatedResources.forEach(resource => {
        if (resource.name != updatedResource.name) {
          resourcesRemoved.push(resource);
        }
      });
      updatedResources = resourcesRemoved;
    } else {
      Object.keys(updatedResource).forEach(key => {
        if (updatedResource[key] === undefined || updatedResource[key] === '') {
          delete updatedResource[key];
        }
      });
      let summary = [];
      Object.keys(updatedResource).forEach(key => {
        if (key != 'name') {
          summary.push(updatedResource[key]);
        }
      });
      updatedResource.summary = summary.join(', ');
      updatedResources.push(updatedResource);
    }
    setResources(updatedResources);
    setHasValue(updatedResources.length > 0);
  };
  const handleError = errorMsg => console.log(errorMsg);

  const updateNotes = notes => {
    referral.notes = notes;
    setHasValue(
      referral.assets.length > 0 ||
        referral.vulnerabilities.length > 0 ||
        referral.notes
    );
  };

  const {
    dob,
    firstName,
    lastName,
    postcode,
    assets,
    vulnerabilities,
    notes
  } = referral;
  let customerId = referral.systemIds?.[0];
  const residentCoordinates = geoCoordinates(postcode);
  const INH_URL = process.env.INH_URL;

  return (
    <>
      <div>
        {editReferral && customerId && (
          <a
            href={`${INH_URL}/help-requests/edit/${customerId}`}
            className="govuk-back-link back-button"
            data-testid="back-link-test"
          >
            Back
          </a>
        )}
      </div>
      <h1 className="no-bottom-margin">{firstName}'s resources</h1>
      <div className="summary-sections">
        {editReferral && (
          <>
            <TextArea
              name="notes"
              label="What prompted the Resident to get in touch today?"
              onChange={updateNotes}
            />
          </>
        )}
      </div>

      {dob && (
        <span
          className="govuk-body govuk-!-font-weight-bold"
          data-testid="age-and-date-of-birth"
        >
          Aged {convertIsoDateToYears(dob)} ({convertIsoDateToString(dob)})
        </span>
      )}
      {editReferral && (
        <>
          <TopicExplorer topics={topics} />
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      )}
      {editReferral && (
        <>
          <h2>Resources for residents</h2>
          Resident's postcode: {postcode}
          <VulnerabilitiesGrid
            onError={handleError}
            onUpdate={updateSelected}
            resources={resources}
            residentCoordinates={residentCoordinates}
            updateSelectedResources={updateSummaryResource}
            customerId={customerId}
          />
          <Button
            text="Finish &amp; save"
            onClick={async () => {
              await updateReferral(referral, selectedResources);
              setEditReferral(false);
            }}
            disabled={!hasValue}
            data-testid="finish-and-save-button"
          />
        </>
      )}
      {!editReferral && (
        <>
          <div className="summary-sections" data-testid="notes-summary">
            <h3 className="summary-titles">
              What prompted the Resident to get in touch today?
            </h3>
            {notes ? notes : 'Nothing captured'}
          </div>

          <div className="govuk-grid-row">
            <div
              className="summary-sections govuk-grid-column-one-half"
              data-testid="vulnerabilities-summary"
            >
              <h3 className="summary-titles">Vulnerabilities</h3>
              {vulnerabilities.length > 0 ? (
                <div>
                  {vulnerabilities.map((v, i) => (
                    <span key={`vuln-${i}`}>
                      {v.name}
                      {v.data.length > 0 && (
                        <ul>
                          {v.data.map((data, n) => (
                            <li key={`vuln-${i}-data-${n}`}>
                              {data.label}: {data.value}
                            </li>
                          ))}
                        </ul>
                      )}
                      <br></br>
                    </span>
                  ))}
                </div>
              ) : (
                'None captured'
              )}
            </div>

            <div
              className="summary-sections govuk-grid-column-one-half"
              data-testid="assets-summary"
            >
              <h3 className="summary-titles">Strengths identified</h3>
              {assets.length > 0 ? (
                <div>
                  {assets.map((a, i) => (
                    <span key={`asset-${i}`}>
                      {a.name}
                      <br></br>
                    </span>
                  ))}
                </div>
              ) : (
                'None captured'
              )}
            </div>
          </div>
          <div className="summary-sections" data-testid="resources-summary">
            <h3 className="summary-titles">Resources</h3>
            {selectedResources.map((r, i) => (
              <div>
                <div className="resource-title">{r.name}</div>
                <div className="resource-description" key={`resource-${i}`}>
                  {r.summary}
                </div>
              </div>
            ))}
          </div>

          <div className="govuk-grid-row govuk-!-margin-top-5">
            {customerId && (
              <div className="govuk-grid-column-one-half">
                <a
                  href={`${INH_URL}/help-requests/complete/${customerId}`}
                  className="govuk-button"
                  data-testid="continue-link-to-inh"
                >
                  Continue
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

ReferralSummary.getInitialProps = async ({
  query: { id },
  req: { headers },
  res
}) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialReferral = await requestReferral(id, { token });
    const resources = await requestResources({ token });
    const topics = await requestPrompts({ token });
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;

    return {
      resources: resources.data,
      initialReferral,
      token,
      topics: topics.data,
      showTopicExplorer
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default ReferralSummary;
