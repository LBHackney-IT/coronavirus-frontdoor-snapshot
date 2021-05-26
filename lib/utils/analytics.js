const sendDataToAnalytics = ({ action, category, label, value, non_interaction = false }) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    non_interaction
  });
};

export { sendDataToAnalytics };
