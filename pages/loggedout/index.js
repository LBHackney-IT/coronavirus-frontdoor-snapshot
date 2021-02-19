export default function LoggedOut() {
  const url = process.env.NEXT_PUBLIC_URL
  const returnUrl = "https://auth.hackney.gov.uk/auth?redirect_uri=" + url

  return (
    <>
<h1 className='govuk-heading-l'>You need permission to access this service</h1>
      <p className='govuk-body'><a href={returnUrl} className='govuk-link'>Sign in to your Hackney account.</a></p>
      <p className='govuk-body'>If you're already signed in, contact Chris Caden to get access (christopher.caden@hackney.gov.uk).</p>
    </>
  );
}
