const SupportSummary = ({ referralSummary }) => {
  return (
    <>
      <div className="govuk-heading-l govuk-!-margin-top-9">Summary of todays support</div>
      <strong className="govuk-heading-s override-margin-bottom">Services referred to</strong>
      {referralSummary.map(referral => (
        <div>{referral.serviceName}</div>
      ))}
    </>
  );
};

export default SupportSummary;
