const topics = () => [
  {
    prompt: 'Common symptoms',
    supportingInformation: 'High temperature. A new, continuous cough. Loss or change to your sense of smell or taste.',
    tags: ['covid', 'coronavirus', 'coronovirus', 'cv', 'lockdown', 'test']
  },
  {
    prompt: 'If you have COVID symptoms, do not go to your GP, pharmacy or a hospital.',
    tags: ['covid', 'coronavirus', 'coronovirus', 'cv', 'lockdown']
  },
  {
    prompt: 'How does testing work?',
    supportingInformation: "Anyone with coronavirus symptoms can get a test. (Search 'test' for more info.)",
    tags: ['covid', 'coronavirus', 'coronovirus', 'cv', 'lockdown']
  },
  {
    prompt: 'Home test or test site?',
    supportingInformation: 'There may be worries about leaving the house. Past day 5 of symptoms, home tests are not suitable.',
    tags: ['test']
  },
  {
    prompt: 'How many days have you had symptoms for?',
    supportingInformation: 'You need to get a test done in the first 5 days of having symptoms.',
    tags: ['test']
  },
  {
    prompt: 'Useful links',
    supportingInformation: "[The government guidance on testing](https://www.gov.uk/get-coronavirus-test)",
    tags: ['test']
  },
  {
    prompt: "Do you have anyone you can talk to if you're worried?",
    supportingInformation: "Friends, family, citizen's advice",
    tags: ['scam']
  },
  {
    prompt: "Have you seen our advice on avoiding scams?",
    supportingInformation: "[Our COVID scam advice page](https://hackney.gov.uk/coronavirus-scams)",
    tags: ['scam']
  },
  {
    prompt: 'Can you access food?',
    supportingInformation: 'Are you able to leave the house? Can anyone shop for you?',
    tags: ['food', 'shopping', 'hungry']
  },
  {
    prompt: 'Online shopping',
    supportingInformation: 'Can you shop online? Can you pay for food with a card instead of cash?',
    tags: ['food', 'shopping', 'hungry']
  },
  {
    prompt: 'Can you afford food?',
    supportingInformation: "Related: Talk about affording heating or other hardship.",
    tags: ['food', 'shopping', 'hungry']
  },
  {
    prompt: 'Can you afford fuel?',
    supportingInformation: 'Citizen’s Advice have fuel vouchers available for families in hardship. Residents can get more detail by calling **020 8355 4472** or emailing **advice@eastendcab.org.uk**.',
    tags: ['heat', 'cold', 'fuel', 'heating']
  },
  {
    prompt: 'Hackney Council helplines',
    supportingInformation: 'Benefits: **020 8356 3399**, Council Tax: **020 8356 3154**',
    tags: ['heat', 'cold', 'fuel', 'heating', 'benefits']
  }
]

export default topics

// scam, government, central, contacted, contact
// https://hackney.gov.uk/coronavirus-scams

// food
// Can you access food?
//// Are you able to leave the house at the moment?
//// Do you have friends/family/neighbours who can help?
//// Do you have online access?
// Can you afford food?
// Morrisons in X are now delivering food

// benefits, money

// Benefits Helpline: *020 8356 3399**.
// [Hackney Council's Council’s website](https://hackney.gov.uk/coronavirus-financial-support) for advice.
