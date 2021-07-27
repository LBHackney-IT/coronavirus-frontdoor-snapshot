import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class AppDocument extends Document {
  render() {
    return (
      <Html lang="en-GB" className="govuk-template lbh-template">
        <Head>
          <script
            src={`https://www.googleoptimize.com/optimize.js?id=${process.env.OPTIMIZE_ID}`}></script>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}', {
              page_path: window.location.pathname,
              'custom_map': {'dimension1': 'custom_text'},
              'anonymize_ip': true
            });
          `
            }}
          />
        </Head>
        <body className="govuk-template__body lbh-template__body js-enabled">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
