const PhaseBanner = ({ phase, feedbackUrl }) => (
  <div className="govuk-phase-banner">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
      <span className="govuk-phase-banner__text">
        This is our new website design - it's a work in progress. Your{' '}
        <a href={feedbackUrl}>feedback</a> will help us to improve it.
      </span>
    </p>
  </div>
);

export default PhaseBanner;
