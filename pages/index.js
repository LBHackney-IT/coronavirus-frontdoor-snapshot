import useReferral from 'lib/api/utils/useReferral';
import { requestResources, requestPrompts, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { getEmailBody } from 'lib/utils/getEmailBody';
import Services from 'components/Feature/Services';
import TopicExplorer from 'components/Feature/TopicExplorer';
import ResidentDetailsForm from 'components/Feature/ResidentDetailsForm';
import SupportSummary from 'components/Feature/SupportSummary';
import { useState } from 'react';
import jsonwebtoken from 'jsonwebtoken';
import Heading from 'components/Heading';

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
  const [signpostSummary, setSignpostSummary] = useState([]);
  const [referrerData, setReferrerData] = useState({
    'referer-email': refererInfo?.email,
    'referer-name': refererInfo?.name,
    'referer-organisation': refererInfo?.iss
  });

  const residentFormCallback = val => {
    setShowResidentForm(val);
  };
  const residentInfoCallback = value => {
    setResidentInfo(value);
  };
  const updateSignpostSummary = service => {
    let newSignpostSummary;
    if (
      signpostSummary.some(x => x.name == service.name && x.categoryName == service.categoryName)
    ) {
      newSignpostSummary = signpostSummary.filter(
        x => x.name != service.name || x.categoryName != service.categoryName
      );
    } else newSignpostSummary = signpostSummary.concat([{ ...service }]);
    setSignpostSummary(newSignpostSummary);
    setEmailBody(updateEmailBody(newSignpostSummary));
  };

  const updateEmailBody = (
    newSignpostSummary = signpostSummary,
    newReferralSummary = referralSummary
  ) => {
    return getEmailBody(
      residentInfo,
      newSignpostSummary,
      newReferralSummary,
      referrerData
    );
  };

  const [emailBody, setEmailBody] = useState(updateEmailBody());

  return (
    <>
      {process.env.NEXT_PUBLIC_SIGNPOST_ENABLED.toLowerCase() === 'true' && (
        <>
          <Heading as="h2">How to use this tool?</Heading>
          <div className="govuk-!-margin-bottom-5">
            <ol>
              <li className="govuk-!-margin-bottom-1">
                <a href="#topic-explorer-header">Search for a topic</a> to discuss the resident's
                whole story and find out what support they need.
              </li>
              <li className="govuk-!-margin-bottom-1">
                <a href="#resources-header">Search for services</a> and refer residents or signpost
                residents.
              </li>
              <li className="govuk-!-margin-bottom-1">
                <a href="#summary-header">Send a summary email</a> to the resident about your
                conversation and the services you have discussed.
              </li>
            </ol>
          </div>
        </>
      )}
      <ResidentDetailsForm
        residentInfoCallback={residentInfoCallback}
        showResidentForm={showResidentForm}
        setShowResidentForm={setShowResidentForm}
        token={token}
        setReferralCompletion={setReferralCompletion}
        referralCompletion={referralCompletion}
        referralSummary={referralSummary}
        setReferralSummary={setReferralSummary}
        updateEmailBody={updateEmailBody}
        setEmailBody={setEmailBody}
      />
      <div className="govuk-!-margin-top-9">
        {errors.map((err, index) => (
          <p key={`error-getting-resources-${index}`} className="govuk-error-message">
            {err}
          </p>
        ))}
      </div>
      {showTopicExplorer && (
        <>
          <TopicExplorer topics={topics} />
          <hr className="govuk-section-break hr-additional-spacing" />
        </>
      )}
      <h2 id="resources-header">Resources for residents</h2>
      <Services
        taxonomies={fssTaxonomies}
        resources={resources}
        residentInfo={residentInfo}
        refererInfo={refererInfo}
        residentFormCallback={residentFormCallback}
        referralCompletion={referralCompletion}
        setReferralCompletion={setReferralCompletion}
        updateSignpostSummary={updateSignpostSummary}
        referrerData={referrerData}
        setReferrerData={setReferrerData}
      />
      {process.env.NEXT_PUBLIC_SIGNPOST_ENABLED.toLowerCase() === 'true' && (
        <SupportSummary
          referralSummary={referralSummary}
          residentFormCallback={residentFormCallback}
          signpostSummary={signpostSummary}
          referrerData={referrerData}
          setReferrerData={setReferrerData}
          residentInfo={residentInfo}
          emailBody={emailBody}
          setEmailBody={setEmailBody}
          token={token}
        />
      )}
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
