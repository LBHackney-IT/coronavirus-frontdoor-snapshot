const TextArea = ({ label, name, onChange, value }) => {
  const updateValue = e => {
    onChange(e.currentTarget.value);
  };
  return (
    <div className="govuk-form-group even-spacing" data-testid={name}>
      <label htmlFor={`${name}`}>
        <p>{label}</p>
      </label>
      <textarea
        className="govuk-textarea"
        id={name}
        name={name}
        rows="4"
        onChange={updateValue}
        value={value}></textarea>
    </div>
  );
};

export default TextArea;
