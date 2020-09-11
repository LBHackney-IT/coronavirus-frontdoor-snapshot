export default function LoggedOut() {
  const returnUrl = "https://auth.hackney.gov.uk/auth?redirect_uri=" + process.env.NEXT_PUBLIC_URL

  return (
    <>
      <h1 className='govuk-heading-l'>You need permission to access this service</h1>
      <p className='govuk-body'><a href={returnUrl} className='govuk-link'>Log in to your Hackney account.</a></p>
      <p className='govuk-body'>If you're already logged in, contact Chris Caden to get access (christopher.caden@hackney.gov.uk).</p>
    </>
  );
}
