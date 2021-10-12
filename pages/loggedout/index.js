import Head from 'next/head';

export default function LoggedOut() {
  const url = process.env.NEXT_PUBLIC_URL;
  const returnUrl = 'https://auth.hackney.gov.uk/auth?redirect_uri=' + url;

  return (
    <>
      <Head>
        <title>Sign-In</title>
      </Head>
      <h1 className="govuk-heading-l">You need permission to access this service</h1>
      <p className="govuk-body">
        <a href={returnUrl} className="govuk-link">
          Sign in to your Hackney account.
        </a>
      </p>
      <p className="govuk-body">
        If you're already signed in, contact Zoe Tyndall to get access (zoe.tyndall@hackney.gov.uk).
      </p>
    </>
  );
}
