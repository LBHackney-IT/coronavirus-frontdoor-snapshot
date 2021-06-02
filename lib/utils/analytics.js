/* eslint-disable no-undef */
import {
  USER_GROUP_C19,
  USER_GROUP_ASC_FRONDOOR,
  USER_GROUP_ASC_INFORMATION,
  USER_GROUP_EXTERNAL,
  USER_GROUP_OTHER
} from 'lib/utils/analyticsConstants';

const sendDataToAnalytics = ({ action, category, label, value, non_interaction = false }) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    non_interaction
  });
};

const getUserGroup = groups => {
  if (groups.includes(process.env.ALLOWED_GROUPS)) return USER_GROUP_C19;
  if (groups.includes(process.env.ASC_FRONTDOOR_USER_GROUP)) return USER_GROUP_ASC_FRONDOOR;
  if (groups.includes(process.env.ASC_INFORMATION_USER_GROUP)) return USER_GROUP_ASC_INFORMATION;
  if (groups.includes(process.env.EXTERNAL_USER_GROUP)) return USER_GROUP_EXTERNAL;
  return USER_GROUP_OTHER;
};

export { sendDataToAnalytics, getUserGroup };
