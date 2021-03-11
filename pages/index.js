import useSnapshot from 'lib/api/utils/useSnapshot';
import { requestResources, requestPrompts, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import Services from 'components/Feature/Services';
import TopicExplorer from 'components/Feature/TopicExplorer';

const Index = ({
  resources,
  initialSnapshot,
  token,
  showTopicExplorer,
  topics,
  fssTaxonomies,
  errors
}) => {
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

  return (
    <>
    <div>{errors.map(err=> <p className="govuk-error-message">{err}</p>)}</div>
      {showTopicExplorer && (
        <>
          <TopicExplorer topics={topics} />
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      )}
      <h2>Resources for residents</h2>
      <Services taxonomies={fssTaxonomies} resources={resources} />
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
    const initialSnapshot = { vulnerabilities: [], assets: [], notes: null };
    const otherResources = await requestResources({ token });
    const fss = await requestFssResources({
      token
    });
    const fssResources = fss.data.fssResources;
    const fssTaxonomies = fss.data.fssTaxonomies;
    const fssErrors = fss.error;
    
    const topics = await requestPrompts({ token });
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;
    const errors = [otherResources.error].concat(fssErrors).concat(topics.error);

    return {
      resources: (fssResources).concat(otherResources.data),
      initialSnapshot,
      token,
      showTopicExplorer,
      topics: topics.data,
      fssTaxonomies,
      errors
    };
  } catch (err) {
    console.log('Failed to load initial Props:' + err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
