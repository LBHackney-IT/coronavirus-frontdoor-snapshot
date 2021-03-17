const CheckboxList = ({ children, className, resource, checkboxType }) => {
  let label;
  if (resource == 'food-needs' && checkboxType == 'asset') {
    label = 'Situation:';
  } else if (resource == 'food-needs' && checkboxType == 'vulnerability') {
    label = 'Dietary:';
  } else if (checkboxType == 'asset') {
    label = 'Strength:';
  } else {
    label = 'Help with:';
  }
  return (
    <div className="govuk-form-group checkbox-list">
      <div>
        <label className="horizontal-label">{label}</label>
      </div>
      <div className={`govuk-checkboxes`}>{children}</div>
    </div>
  );
};

export default CheckboxList;
