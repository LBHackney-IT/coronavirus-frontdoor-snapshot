import React from 'react';

const ResidentDetails = ({
  validationError,
  onInvalidField,
  handleOnChange,
  preserveFormData,
  residentInfo,
  formType
}) => {
  return (
    <div>
      <h2 className="govuk-heading-m" id="resident-details-header">
        Who are you helping?
      </h2>

      <div
        className={`govuk-form-group ${
          validationError.firstName ? 'govuk-form-group--error' : ''
        }`}>
        <div className="govuk-!-padding-bottom-2">
          <label
            id={`first-name-label-${formType}`}
            className="govuk-label inline"
            htmlFor="firstName">
            First name
          </label>
          <span id={`first-name-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.firstName} data-testid="name-error">
              Enter the first name
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.firstName ? 'govuk-input--error' : ''}`}
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={preserveFormData ? residentInfo?.firstName : ''}
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            aria-describedby={`first-name-label-${formType}`}
            onInvalid={e => onInvalidField(e.target.id)}
            required
          />
        </div>
      </div>
      <div
        className={`govuk-form-group ${validationError.lastName ? 'govuk-form-group--error' : ''}`}>
        <div className="govuk-!-padding-bottom-2">
          <label
            id={`last-name-label-${formType}`}
            className="govuk-label inline"
            htmlFor="lastName">
            Last name
          </label>
          <span id={`last-name-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.lastName} data-testid="name-error">
              Enter the last name
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.lastName ? 'govuk-input--error' : ''}`}
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={preserveFormData ? residentInfo?.lastName : ''}
            aria-describedby={`last-name-label-${formType}`}
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            onInvalid={e => onInvalidField(e.target.id)}
            required
          />
        </div>
      </div>
      <div className={`govuk-form-group ${validationError.phone ? 'govuk-form-group--error' : ''}`}>
        <div className="govuk-!-padding-bottom-2">
          <label id={`phone-label-${formType}`} className="govuk-label inline" htmlFor="phone">
            Phone
          </label>
          <span id={`phone-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.phone} data-testid="phone-error">
              Enter the phone number
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.phone ? 'govuk-input--error' : ''}`}
            id="phone"
            name="phone"
            type="number"
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            defaultValue={preserveFormData ? residentInfo?.phone : ''}
            required
            onInvalid={e => onInvalidField(e.target.id)}
            aria-describedby={`phone-label-${formType}`}
          />
        </div>
      </div>
      <div className={`govuk-form-group ${validationError.email ? 'govuk-form-group--error' : ''}`}>
        <div className="govuk-!-padding-bottom-2">
          <label id={`email-label-${formType}`} className="govuk-label inline" htmlFor="email">
            Email
          </label>
          <span id={`email-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.email} data-testid="email-error">
              Enter the email address
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.email ? 'govuk-input--error' : ''}`}
            id="email"
            name="email"
            type="email"
            spellCheck="false"
            defaultValue={preserveFormData ? residentInfo?.email : ''}
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            required={formType == 'summary'}
            onInvalid={e => onInvalidField(e.target.id)}
            aria-describedby={`email-label-${formType}`}
          />
        </div>
      </div>
      <div
        className={`govuk-form-group ${validationError.address ? 'govuk-form-group--error' : ''}`}>
        <div className="govuk-!-padding-bottom-2">
          <label id={`address-label-${formType}`} className="govuk-label inline" htmlFor="address">
            Address
          </label>
          <span id={`address-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.address} data-testid="address-error">
              Enter the address
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.address ? 'govuk-input--error' : ''}`}
            id="address"
            name="event-name"
            type="text"
            defaultValue={preserveFormData ? residentInfo?.address : ''}
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            required
            onInvalid={e => onInvalidField(e.target.id)}
            aria-describedby={`address-label-${formType}`}
          />
        </div>
      </div>
      <div
        className={`govuk-form-group ${validationError.postcode ? 'govuk-form-group--error' : ''}`}>
        <div className="govuk-!-padding-bottom-2">
          <label
            id={`postcode-label-${formType}`}
            className="govuk-label inline"
            htmlFor="postcode">
            Postcode
          </label>
          <span id={`postcode-error-${formType}`} className="govuk-error-message">
            <span hidden={!validationError.postcode} data-testid="postcode-error">
              Enter the postcode
            </span>
          </span>
          <input
            className={`govuk-input  ${validationError.postcode ? 'govuk-input--error' : ''}`}
            id="postcode"
            name="event-name"
            type="text"
            defaultValue={preserveFormData ? residentInfo?.postcode : ''}
            onChange={e => handleOnChange(e.target.id, e.target.value)}
            required
            onInvalid={e => onInvalidField(e.target.id)}
            aria-describedby={`postcode-label-${formType}`}
          />
        </div>
      </div>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset" role="group">
          <legend className="govuk-fieldset__legend">Date of birth</legend>
          <div className="govuk-date-input" id="date-of-birth">
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  id={`dob-day-label-${formType}`}
                  className="govuk-label govuk-date-input__label"
                  htmlFor="date-of-birth-day">
                  Day
                </label>
                <input
                  className="govuk-input govuk-date-input__input govuk-input--width-2"
                  id="date-of-birth-day"
                  name="date-of-birth-day"
                  type="text"
                  defaultValue={
                    preserveFormData && residentInfo ? residentInfo['date-of-birth-day'] : ''
                  }
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={e => handleOnChange(e.target.id, e.target.value)}
                  aria-describedby={`dob-day-label-${formType}`}
                />
              </div>
            </div>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  id={`dob-month-label-${formType}`}
                  className="govuk-label govuk-date-input__label"
                  htmlFor="date-of-birth-month">
                  Month
                </label>
                <input
                  className="govuk-input govuk-date-input__input govuk-input--width-2"
                  id="date-of-birth-month"
                  name="date-of-birth-month"
                  type="text"
                  defaultValue={
                    preserveFormData && residentInfo ? residentInfo['date-of-birth-month'] : ''
                  }
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={e => handleOnChange(e.target.id, e.target.value)}
                  aria-describedby={`dob-month-label-${formType}`}
                />
              </div>
            </div>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  id={`dob-year-label-${formType}`}
                  className="govuk-label govuk-date-input__label"
                  htmlFor="date-of-birth-year">
                  Year
                </label>
                <input
                  className="govuk-input govuk-date-input__input govuk-input--width-4"
                  id="date-of-birth-year"
                  name="date-of-birth-year"
                  type="text"
                  defaultValue={
                    preserveFormData && residentInfo ? residentInfo['date-of-birth-year'] : ''
                  }
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onChange={e => handleOnChange(e.target.id, e.target.value)}
                  aria-describedby={`dob-year-label-${formType}`}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default ResidentDetails;
