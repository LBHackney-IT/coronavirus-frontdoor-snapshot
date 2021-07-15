/* eslint-disable no-undef */
import { ANALYTICS_GROUPS } from 'lib/utils/constants';

const sendDataToAnalytics = ({
  action,
  category,
  label,
  value,
  custom_text,
  non_interaction = false
}) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    custom_text,
    non_interaction
  });
};

const getUserGroup = groups => {
  if (!groups || Object.keys(ANALYTICS_GROUPS).filter(x => groups.includes(x)).length == 0)
    return ANALYTICS_GROUPS['Other'];
  return ANALYTICS_GROUPS[Object.keys(ANALYTICS_GROUPS).filter(x => groups.includes(x))[0]];
};

export { sendDataToAnalytics, getUserGroup };
