const CheckboxList = ({ children, className }) => {
  return (
    <div className="govuk-form-group">
      <div
        className={`govuk-checkboxes`}
      >
        {children}
      </div>
    </div>
  );
};

export default CheckboxList;
