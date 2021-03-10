import React from 'react';
import { useState } from 'react';

const ResidentDetailsForm = ({ gernericRefferalFormCompleteCallback, referralClicked, residentInfoCallback}) => {
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
      residentInfoCallback(residentInfo)
    } else {
      gernericRefferalFormCompleteCallback(false);
    }
  };

  return (
    <div>
       <h1 className="govuk-heading-l">Who are you helping?</h1>
      <details className="govuk-details"  onClick={() => setShowAddResidentForm(!showAddResidentForm)}>
        <summary>Residents details</summary>
      </details>

      {(referralClicked || showAddResidentForm) && (
        <form id='resident-details' onSubmit={()=> console.log("doneee")}>
          <div
            className={`govuk-form-group ${
              !residentInfo.name && referralClicked ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="name">
                Name
              </label>
              <span id="name-error" className="govuk-error-message" aria-describedby="input-name-error">
                <span
                  hidden={!residentInfo.name && referralClicked ? false : true}
                  data-testid="name-error"
                >
                  Enter the name
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  (!residentInfo.name && referralClicked) ? 'govuk-input--error' : ''
                }`}
                id="name"
                name="event-name"
                type="text"
                aria-describedby="event-name-hint"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                aria-describedby="name"
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.phone && referralClicked ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="phone">
                Phone
              </label>
              <span id="phone-error" className="govuk-error-message" aria-describedby="input-phone-error">
                <span
                  hidden={!residentInfo.phone && referralClicked ? false : true}
                  data-testid="phone-error"
                >
                  Enter the phone number
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.phone && referralClicked ? 'govuk-input--error' : ''
                }`}
                id="phone"
                name="event-name"
                type="number"
                aria-describedby="telephone-number-error"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
                required
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.email && referralClicked ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="email">
                Email
              </label>
              <span id="email-error" className="govuk-error-message" aria-describedby="input-email-error">
                <span
                  hidden={!residentInfo.email && referralClicked ? false : true}
                  data-testid="email-error"
                >
                  Enter the email address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.email && referralClicked ? 'govuk-input--error' : ''
                }`}
                id="email"
                name="email"
                type="email"
                spellCheck="false"
                aria-describedby="email-hint email error"
                onChange={e => handleOnChange(e.target.id, e.target.value)}
              />
            </div>
          </div>
          <div
            className={`govuk-form-group ${
              !residentInfo.address && referralClicked ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="address">
                Address
              </label>
              <span id="address-error" className="govuk-error-message" aria-describedby="input-address-error">
                <span
                  hidden={!residentInfo.address && referralClicked? false : true}
                  data-testid="address-error"
                >
                  Enter the address
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.address && referralClicked? 'govuk-input--error' : ''
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
              !residentInfo.postcode && referralClicked ? 'govuk-form-group--error' : ''
            }`}
          >
            <div className="govuk-!-padding-bottom-2">
              <label className="govuk-label inline" htmlFor="postcode">
                Postcode
              </label>
              <span id="postcode-error" className="govuk-error-message" aria-describedby="input-postcode-error">
                <span
                  hidden={!residentInfo.postcode  && referralClicked? false : true}
                  data-testid="postcode-error"
                >
                  Enter the postcode
                </span>
              </span>
              <input
                className={`govuk-input govuk-!-width-two-thirds ${
                  !residentInfo.postcode  && referralClicked ? 'govuk-input--error' : ''
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

export default ResidentDetailsForm;
