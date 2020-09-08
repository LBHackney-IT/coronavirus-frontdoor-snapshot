const TextArea = ({ label, name, onChange, value }) => {
  const updateValue = e => {
    onChange(e.currentTarget.value);
  };
  return (
    <div className="govuk-form-group even-spacing" data-testid={name}>
      <h3 htmlFor={`${name}`}>
        {label}
      </h3>
      <textarea
        className="govuk-textarea"
        id={name}
        name={name}
        rows="5"
        onChange={updateValue}
        value={value}
      ></textarea>
    </div>
  );
};

export default TextArea;
