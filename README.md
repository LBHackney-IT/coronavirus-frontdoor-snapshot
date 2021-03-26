# Better Conversations

This tool was designed and built to enable a variety of staff across the council (Customer Services, Social Care
Practitioners) and external workers (Voluntary Support Network, GPs, etc) to have meaningful conversations with
residents about topics that may be out of their day-to-day remit.

Better Conversations provides the ability to search for conversational prompts on certain topics, such as "Coronavirus",
"Food", "Health", and "Benefits". The prompts are curated in an Airtable to provide the resident with the best experience
no matter the background of the person they're talking to.

Users can refer residents directly to services where the service accepts referrals via email, as well as providing
receipts to the resident.

## Intended Users & Authorisation

* Hackney Customer Services can use the tool to have meaningful conversations on inbound or outbound calls.
* Voluntary Sector Workers can discover and refer residents to other services, or council services. 

There are types of authorisation groups that are permitted access to the tool, these are configured using environment
variables:

* `ALLOWED_GROUPS` - 
* `BASIC_ALLOWED_GROUPS` - 

The groups stored in those environment variables will differ. Speak to an active maintainer for more information.


## History

The tool was initially a forked version of the Benefits and Housing Needs
[LBHackney-IT/housing-needs-vulnerabilities](https://github.com/LBHackney-IT/housing-needs-vulnerabilities) project. It
has since undergone significant changes in terms of functionality, however some old references to "vulnerabilities" may
be present in the code base.

## Technology

This application is built using Next.js in Javascript with DynamoDB and hosted in AWS.

To provide text message and email, GOV.UK Notify is used.

For error monitoring and logging, AWS CloudWatch is used.

## Development

Please see the separate [Development Guide](./docs/development.md).

## Contributing

Please see the separate [Contributing Guide](./CONTRIBUTING.md).

## Further Documentation

* [Project Drive](https://drive.google.com/drive/u/0/folders/0ADRAoyKRsyCkUk9PVA)
* [Project Documentation](https://docs.google.com/document/d/1jPv-VTpeJvvCZdRepX-WC6GDgDs2w_J9gPzjyvdevPE/edit)

## See Related Projects

* [LBHackney-IT/cv-19-res-support-v3](https://github.com/LBHackney-IT/cv-19-res-support-v3) API for Here To Help
* [LBHackney-IT/coronavirus-here-to-help-frontend](https://github.com/LBHackney-IT/coronavirus-here-to-help-frontend) Frontend for Here To Help

## Contributors

### Acitve Maintainers

* **Liudvikas Taluntis** - Engineer at Hackney

### Previous Maintainers

* **Andy Carr** - FutureGov
* **Antony O'Neill** - Lead Engineer at [Made Tech](https://www.madetech.com/) ([antony@ant-web.co.uk](mailto:antony@ant-web.co.uk))
* **Ben Dalton** - Engineer at [Made Tech](https://www.madetech.com/) ([ben.dalton@madetech.com](mailto:ben.dalton@madetech.com))
* **Bogdan Zaharia** - Engineer at [Made Tech](https://www.madetech.com/)
* **Elena Vilimaite** - Senior Engineer at [Made Tech](https://www.madetech.com/) ([elena@madetech.com](mailto:elena@madetech.com))
* **Katrina Kosiak** - Engineer at [Made Tech](https://www.madetech.com/) ([katrina@madetech.com](mailto:katrina@madetech.com))
* **Kyle Chapman** - Senior Engineer at [Made Tech](https://www.madetech.com/)
* **Matt Millar** - Lead Engineer at [Made Tech](https://www.madetech.com/)
* **Maysa Kanoni** - Engineer at [Made Tech](https://www.madetech.com/) ([maysa@madetech.com](mailto:maysa@madetech.com))
* **Riccardo Noviello** - FutureGov
* **Tom Davies** - Senior Engineer at [Made Tech](https://www.madetech.com/)

## License

[MIT](./LICENSE)
