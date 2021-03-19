import useReferral from 'lib/api/utils/useReferral';
import { requestResources, requestPrompts, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import Services from 'components/Feature/Services';
import TopicExplorer from 'components/Feature/TopicExplorer';
import ResidentDetailsForm from 'components/Feature/ResidentDetailsForm';
import SupportSummary from 'components/Feature/SupportSummary';
import { useState } from 'react';
import jsonwebtoken from 'jsonwebtoken';

const Index = ({
  resources,
  initialReferral,
  token,
  showTopicExplorer,
  topics,
  fssTaxonomies,
  errors,
  refererInfo
}) => {
  const { referral, loading, updateReferral } = useReferral(initialReferral.referralId, {
    initialReferral,
    token
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  const [residentInfo, setResidentInfo] = useState(false);
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [referralCompletion, setReferralCompletion] = useState({ tis: null });
  const [referralSummary, setReferralSummary] = useState([]);

  const residentFormCallback = val => {
    setShowResidentForm(val);
  };
  const residentInfoCallback = value => {
    setResidentInfo(value);
  };
  return (
    <>
      {process.env.REFERRALS_ENABLED == 'true' && (
        <ResidentDetailsForm
          residentInfoCallback={residentInfoCallback}
          showResidentForm={showResidentForm}
          setShowResidentForm={setShowResidentForm}
          token={token}
          setReferralCompletion={setReferralCompletion}
          referralCompletion={referralCompletion}
          referralSummary={referralSummary}
          setReferralSummary={setReferralSummary}
        />
      )}
      <SupportSummary referralSummary={referralSummary} />

      <div className="govuk-!-margin-top-9">
        {errors.map(err => (
          <p className="govuk-error-message">{err}</p>
        ))}
      </div>
      {showTopicExplorer && (
        <>
          <TopicExplorer topics={topics} />
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      )}
      <h2>Resources for residents</h2>
      <Services
        taxonomies={fssTaxonomies}
        resources={resources}
        residentInfo={residentInfo}
        refererInfo={refererInfo}
        residentFormCallback={residentFormCallback}
        referralCompletion={referralCompletion}
        setReferralCompletion={setReferralCompletion}
      />
      <a
        href="https://forms.gle/B6vEMgp7sCsjJqNdA"
        target="_blank"
        className="govuk-button"
        data-testid="feedback-link-test">
        Submit feedback
      </a>
    </>
  );
};

Index.getInitialProps = async ({ req: { headers }, res }) => {
  try {
    const token = getTokenFromCookieHeader(headers);
    const retrieveRefererInfo = token => {
      return jsonwebtoken.decode(token);
    };
    const refererInfo = retrieveRefererInfo(token);
    const initialReferral = { vulnerabilities: [], assets: [], notes: null };
    const otherResources = await requestResources({ token });
    const fss = await requestFssResources({
      token
    });
    const fssResources = fss.data.fssResources;
    const fssTaxonomies = fss.data.fssTaxonomies;
    const fssErrors = fss.error;

    const topics = await requestPrompts({ token });
    const showTopicExplorer = process.env.SHOW_TOPIC_EXPLORER;
    const resources = fssResources.concat(otherResources.data).sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    const errors = [otherResources.error].concat(fssErrors).concat(topics.error);

    return {
      resources,
      initialReferral,
      token,
      showTopicExplorer,
      topics: topics.data,
      fssTaxonomies,
      errors,
      refererInfo
    };
  } catch (err) {
    console.log('Failed to load initial Props:' + err);
    res.writeHead(err instanceof HttpStatusError ? err.statusCode : 500).end();
  }
};

export default Index;
