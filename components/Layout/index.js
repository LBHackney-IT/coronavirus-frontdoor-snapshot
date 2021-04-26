import CookieBanner from '../CookieBanner';
import Footer from './Footer';
import Header from './Header';
import SkipLink from './SkipLink';
import PhaseBanner from './PhaseBanner';

const Layout = ({ children }) => (
  <>
    <CookieBanner />
    <SkipLink />
    <Header serviceName="Support for Hackney residents" />

    <div className="govuk-width-container app-width-container">
      <PhaseBanner
        phase="beta"
        feedbackUrl="https://docs.google.com/forms/d/1QcYtxO27MEa_0473968JmVHVidG3Nlrl6vaYM0CCWFY"
      />
      <main className="govuk-main-wrapper app-main-class" id="content" role="main">
        {children}
      </main>
    </div>
    <Footer />
  </>
);

export default Layout;
