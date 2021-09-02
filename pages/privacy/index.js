import Heading from 'components/Heading';
import Head from 'next/head';

export default function Privacy() {
  const collectedInfo = [
    {
      behaviour: 'Visiting website',
      justification:
        'To understand the usage of the tool and see which user groups are using the tool the most',
      essential: 'yes'
    },
    {
      behaviour: 'Search for services',
      justification:
        'To understand common search terms and improve the search functionality based on',
      essential: 'yes'
    },
    {
      behaviour: 'Category clicked',
      justification:
        'To understand the how often users interact with the categories and which is the most popular category for users and identify ways to improve that user journey',
      essential: 'yes'
    },
    {
      behaviour: 'Open referral',
      justification:
        'To understand the number of users who engage with the referral feature and identify ways to improve that user journey',
      essential: 'yes'
    },
    {
      behaviour: 'Click service website',
      justification:
        'To understand the number of users who are leaving the site to read more about a particular service',
      essential: 'yes'
    },
    {
      behaviour: 'Click view summary email',
      justification:
        'To understand the number of users who engage with the summary email and identify ways to improve that user journey',
      essential: 'yes'
    },
    {
      behaviour: 'Submit summary email (Success)',
      justification:
        'To understand the number of users who are succeeding in submitting a summary email',
      essential: 'yes'
    },
    {
      behaviour: 'Submit summary email (invalid)',
      justification:
        'To understand the number of users who are failing to submit a summary email and identify product improvements',
      essential: 'yes'
    },
    {
      behaviour: 'Submit referral (success)',
      justification: 'To understand the number of users who are successfully sending referrals',
      essential: 'yes'
    },
    {
      behaviour: 'Submit referral (fail)',
      justification:
        'To understand the number of users who are failing to send referrals and identify product improvements',
      essential: 'yes'
    },
    {
      behaviour: 'Update referral status',
      justification:
        'To understand the number of referrals which are responded to and given an accept / reject status',
      essential: 'yes'
    }
  ];
  return (
    <>
      <Head>
        <title>Privacy</title>
      </Head>
      <Heading as="h1">Better Conversations Privacy Statement</Heading>
      <Heading as="h2">Analytics and cookies</Heading>
      <p>
        We use Google Analytics and Hotjar to collect information about how you use this site. We do
        this to make sure it’s meeting your needs and to understand how we can make the product work
        better.
      </p>
      <p>
        Google Analytics stores information about what pages on this site you visit, how long you
        are on the site, how you got here and what you click on while you are here.
      </p>
      <p>
        Hotjar sets cookies to help us track behaviour across pages and to control visitor polls.
        The cookies carry no personally identifiable information.
      </p>
      <p>
        We do not use either Hotjar or Google Analytics to collect personal information so this data
        cannot be used to identify who you are. Please read the full Hackney Privacy statement for
        further information.
      </p>
      <p>
        Cookies are small anonymous text files that are placed on your computer by websites that you
        visit. The Council is committed to only using cookies that are either essential (ie they are
        required to make something work) or that help us to make your experience of using the web
        site better.
      </p>
      <p>We collect the following information to help us improve the product:</p>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Behaviour
            </th>
            <th scope="col" className="govuk-table__header">
              Justification
            </th>
            <th scope="col" className="govuk-table__header">
              Essential
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {collectedInfo.map(x => (
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">{x.behaviour}</td>
              <td className="govuk-table__cell">{x.justification}</td>
              <td className="govuk-table__cell">{x.essential}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading as="h2">Change cookie settings for this website</Heading>
      <p>
        Most web browsers allow some control of cookies through the browser settings.{' '}
        <a href="http://www.allaboutcookies.org/">Find out more about cookies</a>, including how to
        see what cookies have been set and how to manage and delete them.
      </p>
      <ul>
        <li>
          <p>
            <a href="https://tools.google.com/dlpage/gaoptout">
              opt out of being tracked by Google Analytics
            </a>{' '}
            across all websites
          </p>
        </li>
        <li>
          <p>
            <a href="https://www.hotjar.com/legal/compliance/opt-out">
              opt out of being tracked by Hotjar
            </a>
          </p>
        </li>
      </ul>
      <Heading as="h2">Personal data </Heading>
      <p>
        We collect personal data through this tool so that professionals can make referrals to
        appropriate services and support residents.
      </p>
      <p>The data we collect includes: </p>
      <ul>
        <li>First name</li>
        <li>Last name</li>
        <li>Phone number</li>
        <li>Email (optional)</li>
        <li>Address</li>
        <li>Postcode</li>
        <li>DOB (optional)</li>
      </ul>
      <p>
        In addition, when a referral is made, we also collect unstructured data to give services a
        professional is referring to more information that can help them to support the resident.{' '}
      </p>
      <p>These fields are: </p>
      <ul>
        <li>Reason for referral</li>
        <li>Notes on wider conversation</li>
      </ul>
      <p>
        For a referral to be made, a professional has to actively seek consent of the resident and
        record that on the tool.
      </p>
      <Heading as="h2">Lawful basis for processing</Heading>
      <p>
        Although staff seek consent before sending referrals, we have a legal basis for processing
        personal data to make referrals and share information with a resident.
      </p>
      <p>
        We are able to share data, both internally and externally, if it satisfies the Data
        Protection Act’s definition of ‘substantial public interest’ (paragraphs 6-28, Schedule 1).
        There are 23 specific definitions and those most relevant to us as a Local Authority include
        using data to:
      </p>
      <ol>
        <li value="11">Protecting the public</li>
        <li value="18">Safeguarding of children and individuals at risk</li>
        <li value="19">Safeguarding of economic wellbeing of certain individuals</li>
      </ol>
      <Heading as="h2">Retention</Heading>
      <p>
        This data is voluntarily shared to staff by residents and the data is then shared to other
        services and organisations. At this point the information comes under the receiving
        services’ information management procedures
      </p>
      <p>
        The case notes data and resident details data are stored in our product’s database as well.
        We are currently discussing internally the appropriate retention period for our product team
        to hold onto the referral data once it’s sent.
      </p>
      <h2>Who to contact about data protection</h2>
      <p>
        Hackney Council is a data controller, registered with the Information Commissioners Office.
      </p>
      <p>
        You can email our Data Protection Officer if you have any queries about your data
        dataprotection@hackney.gov.uk.
      </p>
      <p>
        For independent advice about data protection, privacy and data sharing issues, you can
        contact the Information Commissioners Office (ICO) at:
      </p>
      <p>Information Commissioners Office</p>
      <p>Wycliffe House</p>
      <p>Water Lane</p>
      <p>Wilmslow</p>
      <p>Cheshire</p>
      <p>SK9 5AF</p>
      <p>Tel: 0303 123 1113 (local rate) or 01625 545 745 (national rate)</p>
      <p>
        Or you can visit <a href="http://ico.org.uk/">ico.org.uk</a> or email casework@ico.org.uk
      </p>
    </>
  );
}
