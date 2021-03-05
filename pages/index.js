import { useState } from 'react';
import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestResources, requestPrompts, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import VulnerabilitiesGrid from 'components/Feature/VulnerabilitiesGrid';
import Services from 'components/Feature/Services';
import TopicExplorer from 'components/Feature/TopicExplorer';


const Index = ({ resources, initialSnapshot, token, showTopicExplorer, topics, fssResources, fssTaxonomies }) =>{
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
          <TopicExplorer topics={topics}/>
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      }
      <h2>
      Resources for residents
      </h2>
      {/* <p>
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
      </div> */}
      <Services taxonomies={fssTaxonomies} resources={fssResources} postcode={genericPostcode}/>
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
    const {fssResources, fssTaxonomies} = await requestFssResources({token});
    const topics = await requestPrompts({token})
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;

    return { resources, initialSnapshot, token, showTopicExplorer, topics, fssResources, fssTaxonomies };
  } catch (err) {
    console.log("Failed to load initial Props:" + err)
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
