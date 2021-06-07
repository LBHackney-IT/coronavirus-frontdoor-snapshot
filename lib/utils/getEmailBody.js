const getEmailBody = (residentInfo, newSignpostSummary, newReferralSummary, referrerData) => {
  const discussed =
    newSignpostSummary.length > 0
      ? `We discussed the following services in our conversation today:
    ${newSignpostSummary.map((signpost, index) => getServiceSummaryText(index, signpost)).join('')}`
      : '';

  const referred =
    newReferralSummary.length > 0
      ? `I referred you to the following services:
    ${newReferralSummary.map((ref, index) => getServiceSummaryText(index, ref)).join('')}`
      : '';

  return `If you wish to reply to this email please respond to ${referrerData['referer-name'] ||
    'referrer'} at ${referrerData['referer-email'] || ''}
  
  Hi ${residentInfo.firstName || ''} ${residentInfo.lastName || ''},

${discussed}
${referred}
Thanks, 
${referrerData['referer-name'] || ''}
${referrerData['referer-email'] || ''}
${referrerData['referer-organisation'] || ''}
`;
};

const getServiceSummaryText = (index, service) => {
  return `${index + 1}. ${service.name || ''}
    ${service.telephone || ''} \n
    ${service.contactEmail || ''} \n
    ${service.address || ''} \n
    ${service.websites || ''} \n \n`;
};

export { getEmailBody };
