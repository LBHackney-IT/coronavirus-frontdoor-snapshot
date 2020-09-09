const Checkbox = ({ checked, label, name, onClick, ...others }) => {
  return (
    <div className="govuk-checkboxes__item align-horizontally">
      <input
        className="govuk-checkboxes__input"
        id={name}
        name={name}
        type="checkbox"
        onClick={onClick}
        defaultChecked={checked}
        {...others}
        data-testid={`${name}-checkbox`}
      />
      <label className="govuk-label govuk-checkboxes__label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
