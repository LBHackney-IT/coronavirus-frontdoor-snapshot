import { Kafka } from 'aws-sdk';
import React from 'react';
import { useState } from 'react';

const GenericReferralForm = ({ gernericRefferalFormCompleteCallback, referralClicked }) => {
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [residentInfo, setResidentInfo] = useState({
    name: null,
    email: null,
    phone: null,
    address: null,
    postcode: null
  });

  const handleOnChange = (id, value) => {
    setResidentInfo({ ...residentInfo, [id]: value });
    let newResidentInfo = { ...residentInfo, [id]: value };
    if (Object.values(newResidentInfo).every(k => k)) {
      gernericRefferalFormCompleteCallback(true);
    } else {
      gernericRefferalFormCompleteCallback(false);
    }
  };

  return (
    <div>
      <a href="#" onClick={() => setShowAddResidentForm(!showAddResidentForm)}>
        -Add residents details
      </a>
      <p>here:{referralClicked}</p>
      <h1 className="govuk-heading-l">Who are you helping?</h1>
      {showAddResidentForm && (
        <form>
          <div
            className={`govuk-form-group ${
              !residentInfo.name ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="name">
                Name
              </label>
              <span id="name-error" className="govuk-error-message" aria-describedby="input-name-error">
                <span
                  hidden={!residentInfo.name ? false : true}
                  data-testid="name-error"
                >
                  Enter the name
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.name ? 'govuk-input--error' : ''
                }`}
                id="name"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                aria-describedby="name "
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.phone ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="phone">
                Phone
              </label>
              <span id="phone-error" className="govuk-error-message" aria-describedby="input-phone-error">
                <span
                  hidden={!residentInfo.phone ? false : true}
                  data-testid="phone-error"
                >
                  Enter the phone number
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.phone ? 'govuk-input--error' : ''
                }`}
                id="phone"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.email ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="email">
                Email
              </label>
              <span id="email-error" className="govuk-error-message" aria-describedby="input-email-error">
                <span
                  hidden={!residentInfo.email ? false : true}
                  data-testid="email-error"
                >
                  Enter the email address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.email ? 'govuk-input--error' : ''
                }`}
                id="email"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.address ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="address">
                Address
              </label>
              <span id="address-error" className="govuk-error-message" aria-describedby="input-address-error">
                <span
                  hidden={!residentInfo.address ? false : true}
                  data-testid="address-error"
                >
                  Enter the address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.address ? 'govuk-input--error' : ''
                }`}
                id="address"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.postcode ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="postcode">
                Postcode
              </label>
              <span id="postcode-error" className="govuk-error-message" aria-describedby="input-postcode-error">
                <span
                  hidden={!residentInfo.postcode ? false : true}
                  data-testid="postcode-error"
                >
                  Enter the postcode
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.postcode ? 'govuk-input--error' : ''
                }`}
                id="postcode"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default GenericReferralForm;
