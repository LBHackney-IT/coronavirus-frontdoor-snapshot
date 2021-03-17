import React, { useState, useCallback, useEffect } from 'react';
import cookie from 'cookie';
import moment from 'moment';
import css from './index.module.scss';

const cookieNames = {
  seen: 'seen_cookie_message',
  optedIn: 'cookie_opt_in'
};

const CookieBanner = () => {
  const [cookieState, setCookieState] = useState('read');

  const deleteCookies = () => {
    document.cookie = '_ga= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = '_gid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;';
  };

  const setCookies = optedIn => {
    setCookieState('read');

    const inOneYear = moment().add(1, 'year');
    const setCookie = (name, value) => {
      document.cookie = cookie.serialize(name, value, {
        expires: inOneYear.toDate()
      });
    };

    setCookie(cookieNames.seen, 'true');
    if (optedIn) {
      setCookie(cookieNames.optedIn, optedIn);
    }
  };

  const handleOptIn = useCallback(() => {
    setCookies(true);
  });

  const handleOptOut = useCallback(() => {
    deleteCookies();
    setCookies(false);
  });

  useEffect(() => {
    const cookies = cookie.parse(document.cookie ?? {});
    const hasReadMessage = cookies[cookieNames.seen] === 'true';
    const hasCookieOptIn = cookies[cookieNames.optedIn] === 'true';

    if (hasReadMessage) {
      if (!hasCookieOptIn) {
        deleteCookies();
      }
    } else {
      setCookieState('unread');
    }
  }, []);

  if (cookieState === 'unread') {
    return (
      <div
        id="global-cookie-message"
        className={css.banner}
        role="region"
        aria-label="cookie banner"
        data-testid="cookie-banner">
        <div className="govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div>
                <span className="govuk-heading-m">Tell us whether you accept cookies</span>
                <p className="govuk-body">
                  We use{' '}
                  <a href="https://hackney.gov.uk/privacy" className="govuk-link">
                    cookies to collect information
                  </a>{' '}
                  about how you use this site. We use this information to make the website work as
                  well as possible.
                </p>
              </div>
              <div>
                <button
                  className="govuk-button"
                  type="submit"
                  data-testid="cookies-yes-button"
                  onClick={handleOptIn}>
                  Accept cookies
                </button>
                <button
                  className="govuk-button govuk-button--secondary"
                  type="submit"
                  data-testid="cookies-no-button"
                  onClick={handleOptOut}>
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CookieBanner;
