import useReferral from 'lib/api/utils/useReferral';
import { requestResources, requestPrompts, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import Services from 'components/Feature/Services';
import TopicExplorer from 'components/Feature/TopicExplorer';
import ResidentDetailsForm from 'components/Feature/ResidentDetailsForm'
import { useState } from 'react';

const Index = ({
  resources,
  initialReferral,
  token,
  showTopicExplorer,
  topics,
  fssTaxonomies
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
  const [gernericRefferalFormComplete, setGernericRefferalFormComplete] = useState(false)
  const [residentInfo, setResidentInfo] = useState(false)

  const residentInfoCallback = (value) => {
    setResidentInfo(value)
  }
  return (
    <>
     <ResidentDetailsForm residentInfoCallback={residentInfoCallback} token={token}/>
      {showTopicExplorer && (
        <>
          <TopicExplorer topics={topics}/>
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      )}
      <h2>Resources for residents</h2>
      <Services taxonomies={fssTaxonomies} resources={resources}  gernericRefferalFormComplete={gernericRefferalFormComplete} residentInfo={residentInfo}/>
      <a
        href="https://forms.gle/B6vEMgp7sCsjJqNdA"
        target="_blank"
        className="govuk-button"
        data-testid="feedback-link-test"
      >
        Submit feedback
      </a>
    </>
  );
};

Index.getInitialProps = async ({ req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const initialReferral = { vulnerabilities: [], assets: [], notes: null };
    const otherResources = await requestResources({ token });
    const { fssResources, fssTaxonomies } = await requestFssResources({
      token
    });
    const topics = await requestPrompts({ token });
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;

    return {
      resources: fssResources, //.concat(otherResources),
      initialReferral,
      token,
      showTopicExplorer,
      topics,
      fssTaxonomies
    };
  } catch (err) {
    console.log('Failed to load initial Props:' + err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
