import { TextArea, TextInput, Button } from 'components/Form';
import Details from 'components/Form/Details';
import Heading from 'components/Heading';

const SupportSummary = ({ referralSummary }) => {
  const sendSummary = e => {
    e.preventDefault();
    console.log('sent');
    console.log(e.target);
  };
  return (
    <>
      <Heading as="h2">Send a summary of today's support</Heading>
      <Details title="Email the resident with details of services">
        <div className="govuk-details__text">
          <strong>Services referred to</strong>
          {referralSummary.length == 0 && (
            <span id="summary-referrals-hint" className="govuk-hint  lbh-hint">
              Search for services to refer residents to
            </span>
          )}
          {referralSummary.length > 0 &&
            referralSummary.map(referral => <div>{referral.serviceName}</div>)}
          <strong>Services signposted to</strong>
          <span id="summary-signposts-hint" className="govuk-hint lbh-hint">
            Search for services to signpost residents to
          </span>
          <form id="summary-form" onSubmit={sendSummary}>
            <TextArea label="Add a note for the resident" name="support-summary-note" value="" />
            <strong>Your details</strong>
            <TextInput label="Name" name="summary-name" />
            <TextInput label="Email" name="summary-email" />
            <TextInput label="Organisation" name="summary-organisation" />
            <Button type="submit" text="Send" />
          </form>
        </div>
      </Details>
    </>
  );
};

export default SupportSummary;
