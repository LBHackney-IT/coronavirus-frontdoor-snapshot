const { detect } = require('detect-browser');
import css from '../../styles/ieBanner.module.scss';

const IEBanner = () => {
  const browser = detect();
  const isIE = browser.name === 'ie';
  return (
    <div hidden={!isIE} className={css['ie-support-warning-banner']}>
      <p className={css['ie-banner__content']}>
        <strong id={css['ie-banner__tag']} className={`govuk-tag govuk-phase-banner__content__tag`}>
          Warning!
        </strong>
        <span className="govuk-phase-banner__text">
          Internet Explorer browser is not supported - some features might not behave as expected.
        </span>
      </p>
    </div>
  );
};

export default IEBanner;
