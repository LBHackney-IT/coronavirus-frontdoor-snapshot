import HackneyLogo from './HackneyLogo';
import css from './index.module.scss';
import { useState, useEffect } from 'react';

const Header = ({ serviceName }) => {
  const [selectedNav, setSelectedNav] = useState('');

  useEffect(() => {
    setSelectedNav(window.location.href);
  });
  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div
        className={`govuk-header__container govuk-width-container ${css['lbh-header__container']}`}>
        <div className="govuk-header__logo">
          <span className={`govuk-header__logotype ${css['lbh-header__logotype']}`}>
            <HackneyLogo />
          </span>
        </div>
        <div className="govuk-header__content">
          <a href="/" className="govuk-header__link govuk-header__link--service-name">
            {serviceName}
          </a>
          <nav>
            <ul id="navigation" className="govuk-header__navigation " aria-label="Navigation menu">
              <li
                className={`govuk-header__navigation-item ${
                  selectedNav.includes('my-view') ? 'govuk-header__navigation-item--active' : ''
                }`}>
                <a
                  className="govuk-header__link"
                  href={`${process.env.NEXT_PUBLIC_URL}/my-view`}
                  data-testid="my-view-nav">
                  My referrals
                </a>
              </li>
              <li
                className={`govuk-header__navigation-item ${
                  selectedNav.includes('support-a-resident')
                    ? 'govuk-header__navigation-item--active'
                    : ''
                }`}>
                <a
                  className="govuk-header__link"
                  href={`${process.env.NEXT_PUBLIC_URL}/support-a-resident`}
                  data-testid="support-a-resident-nav">
                  Support a resident
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
