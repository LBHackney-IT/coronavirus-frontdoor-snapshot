import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import TopicExplorer from 'components/Feature/TopicExplorer';
import topics from 'components/Feature/TopicExplorer/topics'

const Index = ({ resources, initialSnapshot, token, showTopicExplorer }) => {
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
      { showTopicExplorer &&
        <>
          <TopicExplorer topics={topics()}/>
          <hr className="govuk-section-break hr-additional-spacing govuk-section-break--visible" />
        </>
      }
      <h1>
        Resource Finder
      </h1>
      <p>
      Enter a postcode to help filter the results by distance:
      </p>
      <div className="govuk-form-group">
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
        href='https://forms.gle/B6vEMgp7sCsjJqNdA' target="_blank"
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
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;

    return { resources, initialSnapshot, token, showTopicExplorer };
  } catch (err) {
    console.log("Failed to load initial Props:" + err)
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
