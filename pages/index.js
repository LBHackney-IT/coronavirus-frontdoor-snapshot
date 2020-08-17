import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';


const Index = ({ resources, initialSnapshot, token }) => {
  const [errorMsg, setErrorMsg] = useState()
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

  const [typingPostcode, setTypingPostcode] = useState();
  const [genericPostcode, setGenericPostcode] = useState();

  const handleError = errorMsg => {
      setErrorMsg(errorMsg)
  }

  const handleUpdate = () => {
    setErrorMsg(null)
  }


  const residentCoordinates = Promise.resolve(null)
  
  return (
    <>
      <h1>
        Resource Finder
      </h1>
      <p>
      Enter a postcode to help filter the results by distance:
      </p>
      <div class="govuk-form-group">
      <p className="govuk-error-message">{genericPostcode && errorMsg}</p>
      <input
        className={'govuk-input govuk-!-width-one-quarter' + ((genericPostcode && errorMsg) ? " govuk-input--error" : "")}
        id="Postcode"
        name="Postcode"
        type="text"
        value={typingPostcode}
        onBlur={(e) => setGenericPostcode(e.target.value)}
      />
      </div>
      <VulnerabilitiesGrid
        onError={handleError}
        onUpdate={handleUpdate}
        resources={resources}
        genericPostcode={genericPostcode}
        residentCoordinates={residentCoordinates}
      />
      <a
        href='https://forms.gle/mLq5Ugxtf2uPZQ3aA' target="_blank"
        className="govuk-button"
        data-testid="feedback-link-test"
      >
        Submit feedback
        </a>
    </>
  );
};

Index.getInitialProps = async ({
  req: { headers },
  res
}) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialSnapshot = { vulnerabilities: [], assets: [], notes: null }
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

export default Index;
