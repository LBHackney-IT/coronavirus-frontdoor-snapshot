import { useEffect, useState } from 'react';
import moment from 'moment';

const DateInput = ({ day, month, name, onChange, showHint, title, validate, year }) => {
  const [dayValue, setDayValue] = useState(day);
  const [monthValue, setMonthValue] = useState(month);
  const [yearValue, setYearValue] = useState(year);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (validate) {
      const date = moment(`${dayValue}-${monthValue}-${yearValue}`, 'DD-MM-YYYY');
      const isValid = dayValue && monthValue && yearValue && date.isValid() && date.isAfter();
      setHasError(!isValid);
    }
  });

  return (
    <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
      <fieldset
        className="govuk-fieldset"
        role="group"
        aria-describedby={`${showHint ? `${name}-hint` : ''}${hasError ? ` ${name}-error` : ''}`}>
        <legend>
          <h3 className="govuk-label">{title}</h3>
        </legend>

        {showHint && (
          <span id={`${name}-hint`} className="govuk-hint">
            For example, 12 10 2025
          </span>
        )}

        {hasError && (
          <span id={`${name}-error`} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> The {title} must be valid and in
            the future
          </span>
        )}

        <div className="govuk-date-input" id={name}>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-day`}>
                Day
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-2${
                  hasError ? ' govuk-input--error' : ''
                }`}
                id={`${name}-day`}
                name={`${name}-day`}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={e => {
                  setDayValue(e.target.value);
                  onChange(e);
                }}
                value={day}
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-month`}>
                Month
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-2${
                  hasError ? ' govuk-input--error' : ''
                }`}
                id={`${name}-month`}
                name={`${name}-month`}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={e => {
                  setMonthValue(e.target.value);
                  onChange(e);
                }}
                value={month}
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label className="govuk-label govuk-date-input__label" htmlFor={`${name}-year`}>
                Year
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-4${
                  hasError ? ' govuk-input--error' : ''
                }`}
                id={`${name}-year`}
                name={`${name}-year`}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={e => {
                  setYearValue(e.target.value);
                  onChange(e);
                }}
                value={year}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DateInput;
