import useReferral from 'lib/api/utils/useReferral';
import { requestResources, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { getEmailBody } from 'lib/utils/getEmailBody';
import Services from 'components/Feature/Services';
import ResidentDetailsForm from 'components/Feature/ResidentDetailsForm';
import SupportSummary from 'components/Feature/SupportSummary';
import { useState } from 'react';
import jsonwebtoken from 'jsonwebtoken';
import Head from 'next/head';

const Index = ({ categorisedResources, initialReferral, token, errors, refererInfo }) => {
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
    'referer-organisation': refererInfo?.groups.includes(process.env.EXTERNAL_USER_GROUP)
      ? ''
      : 'Hackney Council'
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
    return getEmailBody(residentInfo, newSignpostSummary, newReferralSummary, referrerData);
  };

  const [emailBody, setEmailBody] = useState(updateEmailBody());

  return (
    <>
      <Head>
        <title>Better Conversations</title>
      </Head>
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
      <h2 id="resources-header">Resources for residents</h2>
      <Services
        categorisedResources={categorisedResources}
        residentInfo={residentInfo}
        refererInfo={refererInfo}
        residentFormCallback={residentFormCallback}
        referralCompletion={referralCompletion}
        setReferralCompletion={setReferralCompletion}
        updateSignpostSummary={updateSignpostSummary}
        referrerData={referrerData}
        setReferrerData={setReferrerData}
      />
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

    const resources = fssResources.concat(otherResources.data).sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    //filters out taxonomies with no resources
    const categorisedResources = fssTaxonomies.filter(taxonomy =>
      resources.some(resource => resource.categoryName === taxonomy.name)
    );

    //for each taxonomy only leave resources with the same category name as the taxonomy name
    categorisedResources.forEach(
      taxonomy =>
        (taxonomy.resources = resources.filter(resource => taxonomy.name == resource.categoryName))
    );

    const errors = [otherResources.error].concat(fssErrors);

    return {
      categorisedResources,
      initialReferral,
      token,
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
