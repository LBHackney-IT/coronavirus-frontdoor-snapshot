import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestSnapshot, requestResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { Button, TextArea } from 'components/Form';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import { convertIsoDateToString, convertIsoDateToYears } from 'lib/utils/date';
import geoCoordinates from 'lib/api/utils/geoCoordinates';

const SnapshotSummary = ({ resources, initialSnapshot, token }) => {
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

  const updateNotes = notes => {
    snapshot.notes = notes;
    setHasValue(
      snapshot.assets.length > 0 ||
      snapshot.vulnerabilities.length > 0 ||
      snapshot.notes
    );
  };

  const { dob, firstName, lastName, postcode, assets, vulnerabilities, notes } = snapshot;
  let customerId = snapshot.systemIds?.[0];
  // check the external system id for redirecting back to originating system
  let backtoSingleView = true;
  if (customerId && customerId.includes("inh-", 0)) {
    customerId = customerId.substring(4);
    backtoSingleView = false;
  }
  const residentCoordinates = geoCoordinates(postcode);
  
  return (
    <>
      <div>
        { backtoSingleView && (
        <a
          href={`${process.env.NEXT_PUBLIC_SINGLEVIEW_URL}/customers/${customerId}/view`}
          className="govuk-back-link back-button"
          data-testid="back-link-test"
        >
          Back to Single View
        </a>
        )}
        
        { !backtoSingleView && (
          <a
          href={`${process.env.INH_URL}/help-requests/edit/${customerId}`}
          className="govuk-back-link back-button"
          data-testid="back-link-test"
        >
          Back to I Need Help
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
      {editSnapshot && (
        <>
          <VulnerabilitiesGrid
            onUpdate={updateSelected}
            resources={resources}
            residentCoordinates={residentCoordinates}
          />
          <TextArea
            name="notes"
            label="Any other notes you'd like to add?"
            onChange={updateNotes}
          />
          <Button
            text="Finish &amp; save"
            onClick={async () => {
              await updateSnapshot(snapshot);
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

          </div>

          <div data-testid="notes-summary">
            <h2>Notes</h2>
            {notes ? notes : 'None captured'}
          </div>

          <div data-testid="notes-summary">
            <br></br>
            <button className="govuk-button" id="print">Print this page</button><br></br>
            <button className="govuk-button" id="shared-plan">Continue</button>
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
  console.log(process.env.NEXT_PUBLIC_API_URL);
  console.log(process.env.NEXT_PUBLIC_GTM_ID);
  console.log(process.env.NEXT_PUBLIC_SINGLEVIEW_URL);
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialSnapshot = await requestSnapshot(id, { token });
    const resources = await requestResources({ token });
    return {
      resources,
      initialSnapshot,
      token
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default SnapshotSummary;
