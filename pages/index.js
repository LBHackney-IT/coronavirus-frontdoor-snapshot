import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import TopicExplorer from 'components/Feature/TopicExplorer';

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

  const topics = [
    { prompt: 'How are you feeling right now?', tags: ['mental health'] },
    { prompt: 'Do you have anyone supporting you?', tags: ['mental health', 'lonely', 'loneliness'] },
    { prompt: 'Do you talk to your family?', tags: ['lonely', 'loneliness'] },
    { prompt: 'Are you able to shop for food?', tags: ['food'] },
    { prompt: 'Do you know what food help is available in your area?', tags: ['food'] },
    { prompt: '(We are unable to provide food directly)', tags: ['food'] },
    { prompt: 'Have you seen the government guidance on local lockdowns?', tags: ['lockdown'] },
    { prompt: 'Are you worried about something you need?', tags: ['lockdown'] },
    { prompt: '(Hackney has no additional local restrictions right now)', tags: ['lockdown'] },
  ]

  const showTopicExplorer = process.env.NEXT_PUBLIC_SHOW_TOPIC_EXPLORER

  return (
    <>
      { showTopicExplorer &&
        <>
          <TopicExplorer topics={topics}/>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
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
    return {
      resources,
      initialSnapshot,
      token
    };
  } catch (err) {
    console.log("Failed to load initial Props:" + err)
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
