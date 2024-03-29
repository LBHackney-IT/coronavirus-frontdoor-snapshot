import OGL from './OGL';

const Footer = () => (
  <footer className="govuk-footer" role="contentinfo">
    <div className="govuk-width-container">
      <div className="govuk-footer__meta">
        <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
          <h2 className="govuk-visually-hidden">Support links</h2>
          <OGL />
          <span className="govuk-footer__licence-description">
            {'All content is available under the '}
            <a
              className="govuk-footer__link"
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              rel="license">
              Open Government Licence v3.0
            </a>
            , except where otherwise stated
          </span>
          <div className="govuk-!-margin-top-5">
            We use{' '}
            <a href="/privacy" className="govuk-link">
              cookies to collect information
            </a>{' '}
            about how you use this site. We use this information to make the website work as well as
            possible.
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
