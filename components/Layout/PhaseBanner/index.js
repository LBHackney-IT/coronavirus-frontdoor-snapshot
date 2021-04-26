const PhaseBanner = ({ phase, feedbackUrl }) => (
  <div className="govuk-phase-banner">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
      <span className="govuk-phase-banner__text">
        This is our new website design - it's a work in progress. Is information about a service missing?{' '}
        <a className="govuk-link" href={feedbackUrl} target="_blank">
          Please tell us here.
        </a>
      </span>
    </p>
  </div>
);

export default PhaseBanner;
