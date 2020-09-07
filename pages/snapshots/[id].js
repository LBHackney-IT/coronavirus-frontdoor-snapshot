import { useState, useEffect } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestSnapshot, requestResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { Button, TextArea } from 'components/Form';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import { convertIsoDateToString, convertIsoDateToYears } from 'lib/utils/date';
import geoCoordinates from 'lib/api/utils/geoCoordinates';
import TopicExplorer from 'components/Feature/TopicExplorer';
import topics from 'components/Feature/TopicExplorer/topics'

const SnapshotSummary = ({ resources, initialSnapshot, token, showTopicExplorer }) => {
  const { snapshot, loading, updateSnapshot } = useSnapshot(
    initialSnapshot.snapshotId,
    {
      initialSnapshot,
      token
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  const [editSnapshot, setEditSnapshot] = useState(
    snapshot.assets.length === 0 &&
      snapshot.vulnerabilities.length === 0 &&
      !snapshot.notes
  );
  const [hasValue, setHasValue] = useState(false);

  const updateSelected = selected => {
    snapshot.assets = selected.assets;
    snapshot.vulnerabilities = selected.vulnerabilities;
    setHasValue(
      snapshot.assets.length > 0 ||
        snapshot.vulnerabilities.length > 0 ||
        snapshot.notes
    );
  };
  const [selectedResources, setResources] = useState([]);

  const updateSummaryResource = updatedResource => {
    let updatedResources = selectedResources
    if(updatedResources.some(resource => resource.name === updatedResource.name)){
      let resourcesRemoved = []
      updatedResources.forEach((resource) =>{
        if(resource.name != updatedResource.name){
          resourcesRemoved.push(resource)
        }
      })
      updatedResources = resourcesRemoved
    }else{
      Object.keys(updatedResource).forEach(key => {
        if (updatedResource[key] === undefined || updatedResource[key] === '') {
          delete updatedResource[key];
        }
      })
      let summary = []
      Object.keys(updatedResource).forEach(key => {
        summary.push(updatedResource[key])
      })
      updatedResource.summary = summary.join(', ')
      updatedResources.push(updatedResource)
    }
    setResources(updatedResources)
    setHasValue(updatedResources.length > 0);
  }
  const handleError = errorMsg => console.log(errorMsg);

  const updateNotes = notes => {
    snapshot.notes = notes;
    setHasValue(
      snapshot.assets.length > 0 ||
        snapshot.vulnerabilities.length > 0 ||
        snapshot.notes
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
  } = snapshot;
  let customerId = snapshot.systemIds?.[0];
  const residentCoordinates = geoCoordinates(postcode);
  const INH_URL = process.env.INH_URL

  return (
    <>
      <div>
        { editSnapshot && customerId && (
          <a
          href={`${INH_URL}/help-requests/edit/${customerId}`}
          className="govuk-back-link back-button"
          data-testid="back-link-test"
        >
          Back
        </a>

        )}
      </div>
      <h1>
        {firstName} {lastName}
      </h1>
      <p>Postcode: {postcode}</p>
      {dob && (
        <span
          className="govuk-body govuk-!-font-weight-bold"
          data-testid="age-and-date-of-birth"
        >
          Aged {convertIsoDateToYears(dob)} ({convertIsoDateToString(dob)})
        </span>
      )}
      { showTopicExplorer &&
        <>
          <TopicExplorer topics={topics()}/>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
        </>
      }
      {editSnapshot && (
        <>
          <VulnerabilitiesGrid
            onError={handleError}
            onUpdate={updateSelected}
            resources={resources}
            residentCoordinates={residentCoordinates}
            updateSelectedResources={updateSummaryResource}
            customerId={customerId}
          />
          <TextArea
            name="notes"
            label="Any other notes you'd like to add?"
            onChange={updateNotes}
          />
          <Button
            text="Finish &amp; save"
            onClick={async () => {
              await updateSnapshot(snapshot, selectedResources);
              setEditSnapshot(false);
            }}
            disabled={!hasValue}
            data-testid="finish-and-save-button"
          />
        </>
      )}
      {!editSnapshot && (
        <>
          <div data-testid="vulnerabilities-summary">
            <h2>Vulnerabilities</h2>
            {vulnerabilities.length > 0 ? (
              <ul>
                {vulnerabilities.map((v, i) => (
                  <li key={`vuln-${i}`}>
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
                  </li>
                ))}
              </ul>
            ) : (
              'None captured'
            )}
          </div>
          <div data-testid="assets-summary">
            <h2>Assets</h2>
            {assets.length > 0 ? (
              <ul>
                {assets.map((a, i) => (
                  <li key={`asset-${i}`}>{a.name}</li>
                ))}
              </ul>
            ) : (
              'None captured'
            )}
          </div>

          <div data-testid="resources-summary">
            <h2>Resources</h2>
            {selectedResources.map((r, i) => (
                  <li key={`resource-${i}`}>{r.summary}</li>
                )
              )
            }
          </div>

          <div data-testid="notes-summary">
            <h2>Notes</h2>
            {notes ? notes : 'None captured'}
          </div>

          <div className="govuk-grid-row govuk-!-margin-top-9">
           { customerId && (
            <div className="govuk-grid-column-one-half">
              <a
                href={`${INH_URL}/help-requests/complete/${customerId}`}
                className="govuk-button"
                data-testid="continue-link-to-inh">
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

SnapshotSummary.getInitialProps = async ({
  query: { id },
  req: { headers },
  res
}) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialSnapshot = await requestSnapshot(id, { token });
    const resources = await requestResources({ token });
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;
    return {
      resources,
      initialSnapshot,
      token,
      showTopicExplorer
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default SnapshotSummary;
