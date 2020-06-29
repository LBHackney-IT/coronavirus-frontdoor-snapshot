import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestSnapshot } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { Button, TextArea } from 'components/Form';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import { convertIsoDateToString, convertIsoDateToYears } from 'lib/utils/date';

const SnapshotSummary = ({ initialSnapshot, token }) => {
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

  const updateSelected = selected => {
    snapshot.assets = selected.assets;
    snapshot.vulnerabilities = selected.vulnerabilities;
  };

  const updateNotes = notes => {
    snapshot.notes = notes;
  };

  const { dob, firstName, lastName, assets, vulnerabilities, notes } = snapshot;

  return (
    <>
      <h1>
        {firstName} {lastName}
      </h1>
      {dob && (
        <span className="govuk-body govuk-!-font-weight-bold">
          Aged {convertIsoDateToYears(dob)} ({convertIsoDateToString(dob)})
        </span>
      )}
      {editSnapshot && (
        <>
          <VulnerabilitiesGrid onUpdate={updateSelected} />
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
          />
        </>
      )}
      {!editSnapshot && (
        <>
          <div>
            <h2>Vulnerabilities</h2>
            {vulnerabilities.length > 0 ? (
              <ul>
                {vulnerabilities.map((v, i) => (
                  <li key={`vuln-${i}`}>{v}</li>
                ))}
              </ul>
            ) : (
              'None captured'
            )}
          </div>
          <div>
            <h2>Assets</h2>
            {assets.length > 0 ? (
              <ul>
                {assets.map((a, i) => (
                  <li key={`asset-${i}`}>{a}</li>
                ))}
              </ul>
            ) : (
              'None captured'
            )}
          </div>
          <div>
            <h2>Notes</h2>
            {notes ? notes : 'None captured'}
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
    return {
      initialSnapshot,
      token
    };
  } catch (err) {
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default SnapshotSummary;