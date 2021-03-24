import { TextArea, TextInput, Button } from 'components/Form';
import Details from 'components/Form/Details';
import Heading from 'components/Heading';
import { useState } from 'react';

const SupportSummary = ({
  referralSummary,
  signpostSummary,
  referrerData,
  setReferrerData,
  emailBody,
  setEmailBody,
  residentInfo
}) => {
  const [hideForm, setHideForm] = useState(true);

  const sendSummary = async e => {
    e.preventDefault();
    const summary = {
      firstName: residentInfo.firstName,
      lastName: residentInfo.lastName,
      phone: residentInfo.phone,
      email: residentInfo.email,
      address: residentInfo.address,
      postcode: residentInfo.postcode,
      userOrganisation: e.target['summary-organisation'].value,
      userName: e.target['summary-name'].value,
      userEmail: e.target['summary-email'].value,
      dateOfBirth: {
        year: residentInfo['date-of-birth-year'],
        month: residentInfo['date-of-birth-month'],
        day: residentInfo['date-of-birth-day']
      },
      services: signpostSummary.concat(referralSummary),
      signPostingMessage: e.target['support-summary-note'].value
    };
    console.log(summary);

    // const result = await saveSummarry(summary);
  };
  return (
    <>
      <Heading as="h2">Send a summary of today's support</Heading>
      <Details
        title="Email the resident with details of services"
        onclick={() => setHideForm(!hideForm)}>
        <div className="govuk-details__text">
          <strong>Services referred to</strong>
          {referralSummary.length == 0 && (
            <span id="summary-referrals-hint" className="govuk-hint  lbh-hint">
              Search for services to refer residents to
            </span>
          )}
          <div className="govuk-!-margin-bottom-5">
            {referralSummary.length > 0 &&
              referralSummary.map(referral => (
                <div className="govuk-!-margin-bottom-1">{referral.serviceName}</div>
              ))}
          </div>
          <strong>Services signposted to</strong>
          {signpostSummary.length == 0 && (
            <span id="summary-signposts-hint" className="govuk-hint  lbh-hint">
              Search for services to signpost residents to
            </span>
          )}
          <div className="govuk-!-margin-bottom-5">
            {signpostSummary.length > 0 &&
              signpostSummary.map(signpost => (
                <div className="govuk-!-margin-bottom-1">{signpost.serviceName}</div>
              ))}
          </div>
          {!hideForm && (
            <form id="summary-form" onSubmit={sendSummary}>
              <TextArea
                value={emailBody}
                label="Add a note for the resident"
                name="support-summary-note"
                onChange={value => {
                  setEmailBody(value);
                }}
              />
              <strong>Your details</strong>
              <TextInput
                label="Name"
                name="summary-name"
                value={referrerData['referer-name']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-name': value });
                }}
                validate
                required={true}
              />
              <TextInput
                label="Email"
                name="summary-email"
                value={referrerData['referer-email']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-email': value });
                }}
                validate
                required={true}
              />
              <TextInput
                label="Organisation"
                name="summary-organisation"
                value={referrerData['referer-organisation']}
                onChange={value => {
                  setReferrerData({ ...referrerData, 'referer-organisation': value });
                }}
                validate
                required={true}
              />
              <Button type="submit" text="Send" />
            </form>
          )}
        </div>
      </Details>
    </>
  );
};

export default SupportSummary;
