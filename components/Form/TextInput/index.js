import { useEffect, useState } from 'react';

const TextInput = ({
  autoComplete,
  label,
  name,
  onChange,
  validate,
  value,
  className
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (validate) setHasError(!value);
  });

  const updateValue = e => {
    onChange(e.currentTarget.value);
  };

  return (
    <div
      className={`govuk-form-group${
        hasError ? ' govuk-form-group--error' : ''
      }`}
    >
      <label className="govuk-label" htmlFor={name}>
        {label}
      </label>
      {hasError && (
        <span id={`${name}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> The {label} is
          required
        </span>
      )}
      <input
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`${className} govuk-input${hasError ? ` ${className}  govuk-input--error` : ''}`}
        id={name}
        name={name}
        type="text"
        autoComplete={autoComplete}
        onChange={updateValue}
        value={value}
      />
    </div>
  );
};

export default TextInput;
