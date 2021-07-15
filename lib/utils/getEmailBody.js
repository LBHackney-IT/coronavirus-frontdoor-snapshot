const getEmailBody = (residentInfo, newSignpostSummary, newReferralSummary, referrerData, type) => {
  const discussed =
    newSignpostSummary.length > 0
      ? `${['\n']
          .concat(
            newSignpostSummary.map((signpost, index) => getServiceSummaryText(index, signpost))
          )
          .join('')}`
      : '';

  const referred =
    newReferralSummary.length > 0
      ? `I referred you to the following services:${['\n']
          .concat(newReferralSummary.map((ref, index) => getServiceSummaryText(index, ref)))
          .join('')}`
      : '';

  if (type == 'letter') {
    return `Hi ${residentInfo.firstName || ''} ${residentInfo.lastName || ''},

It was nice speaking with you. I am writing to share the contact details of the support services we discussed in our conversation. 

${
  newSignpostSummary.length > 0 ? `We discussed the following services:${discussed}` : ''
}${referred}
If you require any further support please contact the council on ${
      process.env.NEXT_PUBLIC_GENERIC_CONTACT_NUMBER
    }.

Many thanks, 
${referrerData['referer-name'] || ''}
${referrerData['referer-email'] || ''}
${referrerData['referer-organisation'] || ''}
`;
  }
  return `If you wish to reply to this email please respond to ${referrerData['referer-name'] ||
    'referrer'} at ${referrerData['referer-email'] || ''} 
  
Hi ${residentInfo.firstName || ''} ${residentInfo.lastName || ''},

${
  newSignpostSummary.length > 0
    ? `We discussed the following services in our conversation today:${discussed}`
    : ''
}${referred}
Thanks, 
${referrerData['referer-name'] || ''}
${referrerData['referer-email'] || ''}
${referrerData['referer-organisation'] || ''}
`;
};

const getServiceSummaryText = (index, service) => {
  return `${index + 1}. ${service.name || ''}
    ${service.telephone || ''} 
    ${service.contactEmail || ''} 
    ${service.address || ''} 
    ${service.websites || ''}  \n\n`;
};

export { getEmailBody };
