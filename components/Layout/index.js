import CookieBanner from '../CookieBanner';
import Footer from './Footer';
import Header from './Header';
import SkipLink from './SkipLink';
import PhaseBanner from './PhaseBanner';

const Layout = ({ children }) => (
  <>
    <CookieBanner />
    <SkipLink />
    <Header serviceName="Snapshot" />
    <div className="govuk-width-container app-width-container">
      <PhaseBanner
        phase="alpha"
        feedbackUrl="https://forms.gle/PX7Ra2tePBnC3RrX9"
      />
      <main
        className="govuk-main-wrapper app-main-class"
        id="content"
        role="main"
      >
        {children}
      </main>
    </div>
    <Footer />
  </>
);

export default Layout;
