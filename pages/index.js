import useReferral from 'lib/api/utils/useReferral';
import { requestResources, requestFssResources } from 'lib/api';
import HttpStatusError from 'lib/api/domain/HttpStatusError';
import { getTokenFromCookieHeader } from 'lib/utils/token';
import { getEmailBody } from 'lib/utils/getEmailBody';
import Services from 'components/Feature/Services';
import SupportSummary from 'components/Feature/SupportSummary';
import { useState } from 'react';
import jsonwebtoken from 'jsonwebtoken';
import Head from 'next/head';
import { EMAIL } from 'lib/utils/constants';

const Index = ({ categorisedResources, initialReferral, token, errors, refererInfo }) => {
  const { referral, loading, updateReferral } = useReferral(initialReferral.referralId, {
    initialReferral,
    token
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  const [residentInfo, setResidentInfo] = useState(false);
  const [referralCompletion, setReferralCompletion] = useState({ tis: null });
  const [referralSummary, setReferralSummary] = useState([]);
  const [signpostSummary, setSignpostSummary] = useState([]);
  const [referrerData, setReferrerData] = useState({
    'referer-email': refererInfo?.email,
    'referer-name': refererInfo?.name,
    'referer-organisation': refererInfo?.groups.includes(process.env.EXTERNAL_USER_GROUP)
      ? ''
      : 'Hackney Council',
    'user-groups': refererInfo?.groups
  });
  const [preserveFormData, setPreserveFormData] = useState(true);

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
    newReferralSummary = referralSummary,
    newReferrerData = referrerData,
    newResidentInfo = residentInfo,
    type = EMAIL
  ) => {
    return getEmailBody(
      newResidentInfo,
      newSignpostSummary,
      newReferralSummary,
      newReferrerData,
      type
    );
  };

  const [emailBody, setEmailBody] = useState(updateEmailBody());

  return (
    <>
      <Head>
        <title>Better Conversations</title>
        {process.env.NEXT_PUBLIC_ENV != 'test' && <script src="/js/beforeUnload.js"></script>}
      </Head>
      <div className="govuk-!-margin-top-9">
        {errors.map((err, index) => (
          <p key={`error-getting-resources-${index}`} className="govuk-error-message">
            {err}
          </p>
        ))}
      </div>
      <Services
        categorisedResources={categorisedResources}
        residentInfo={residentInfo}
        referralCompletion={referralCompletion}
        setReferralCompletion={setReferralCompletion}
        updateSignpostSummary={updateSignpostSummary}
        signpostSummary={signpostSummary}
        referrerData={referrerData}
        setReferrerData={setReferrerData}
        setResidentInfo={setResidentInfo}
        token={token}
        referralSummary={referralSummary}
        setReferralSummary={setReferralSummary}
        updateEmailBody={updateEmailBody}
        setEmailBody={setEmailBody}
        setPreserveFormData={setPreserveFormData}
        preserveFormData={preserveFormData}
      />
      <SupportSummary
        referralSummary={referralSummary}
        signpostSummary={signpostSummary}
        updateSignpostSummary={updateSignpostSummary}
        referrerData={referrerData}
        setReferrerData={setReferrerData}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        token={token}
        setResidentInfo={setResidentInfo}
        residentInfo={residentInfo}
        updateEmailBody={updateEmailBody}
        setPreserveFormData={setPreserveFormData}
        preserveFormData={preserveFormData}
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

    const categorisedResources = fssTaxonomies.filter(taxonomy =>
      resources.some(resource => resource.categoryName === taxonomy.name)
    );

    categorisedResources.forEach(
      taxonomy =>
        (taxonomy.resources = resources.filter(resource => taxonomy.name == resource.categoryName))
    );

    const errors = [otherResources.error].concat(fssErrors).filter(x => x);

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
