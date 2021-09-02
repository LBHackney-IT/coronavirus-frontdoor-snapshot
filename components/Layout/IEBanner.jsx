const { detect } = require('detect-browser');
import css from '../../styles/banners.module.scss';

const IEBanner = () => {
  const browser = detect();
  const isIE = browser.name === 'ie';

  return isIE ? (
    <div
      id={css['ie-support-warning-banner']}
      hidden={!isIE}
      className="govuk-notification-banner"
      aria-labelledby="govuk-notification-banner-title">
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Warning
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        You may experience difficulties in completing actions on the tool when using Internet
        Explorer.
      </div>
    </div>
  ) : (
    <></>
  );
};

export default IEBanner;
