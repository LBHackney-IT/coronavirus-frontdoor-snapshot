import React from 'react'
import { useState } from 'react';


const GenericReferralForm = ({gernericRefferalFormCompleteCallback}) => {
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [name, setName] = useState(false);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [postcode, setPostcode] = useState(null);
 
 
  const setNameComplete = (value) => {
    setName(value)
   if(value && phone && email && address && postcode){
    gernericRefferalFormCompleteCallback(true)
   }else{
    gernericRefferalFormCompleteCallback(false)
   }

  }
   const setPhoneComplete = (value) => {
    setPhone(value)
    if(value && name && email && address && postcode){
      gernericRefferalFormCompleteCallback(true)
     }else{
      gernericRefferalFormCompleteCallback(false)
     }
  }
  const setEmailComplete = (value) => {
    setEmail(value)
    if(value && name && phone && address && postcode){
      gernericRefferalFormCompleteCallback(true)
     }else{
      gernericRefferalFormCompleteCallback(false)
     }
  }
  const setAddressComplete = (value) => {
    setAddress(value)
    if(value &&phone && name && email && postcode){
      gernericRefferalFormCompleteCallback(true)
     }else{
      gernericRefferalFormCompleteCallback(false)
     }
  }
  const setPostcodeComplete = (value) => {
    setPostcode(value)
    if(value && phone && name && email && address ){
      gernericRefferalFormCompleteCallback(true)
     }else{
      gernericRefferalFormCompleteCallback(false)
     }
  }

  return (
    <div>
      <a href="#" onClick={() => setShowAddResidentForm(!showAddResidentForm)}>-Add residents details</a>
      <h1 className = "govuk-heading-l">
        Who are you helping?
      </h1>
      {showAddResidentForm && <form>
        <div className="govuk-form-group">
          <div className="govuk-!-padding-bottom-2">
            <label className="govuk-label inline mandatoryQuestion" for="name">Name</label>
            <input className="govuk-input govuk-!-width-two-thirds" id="name" name="event-name" type="text" aria-describedby="event-name-hint" onChange={(e)=> setNameComplete(e.target.value)}/>
          </div>
          <div className="govuk-!-padding-bottom-2">
            <label className="govuk-label inline mandatoryQuestion" for="phone">Phone</label>
            <input className="govuk-input govuk-!-width-two-thirds" id="phone" name="event-name" type="text" aria-describedby="event-name-hint" onChange={(e)=> setPhoneComplete(e.target.value)}/>
          </div>
          <div className="govuk-!-padding-bottom-2">
            <label className="govuk-label inline mandatoryQuestion" for="email">Email</label>
            <input className="govuk-input govuk-!-width-two-thirds" id="email" name="event-name" type="text" aria-describedby="event-name-hint" onChange={(e)=> setEmailComplete(e.target.value)}/>
          </div>
          <div className="govuk-!-padding-bottom-2">
            <label className="govuk-label inline mandatoryQuestion" for="address">Address</label>
            <input className="govuk-input govuk-!-width-two-thirds" id="address" name="event-name" type="text" aria-describedby="event-name-hint"  onChange={(e)=> setAddressComplete(e.target.value)}/>
          </div>
          <div className="govuk-!-padding-bottom-2">
            <label className="govuk-label inline mandatoryQuestion" for="postcode">Postcode</label>
            <input className="govuk-input govuk-!-width-two-thirds" id="postcode" name="event-name" type="text" aria-describedby="event-name-hint" onChange={(e)=> setPostcodeComplete(e.target.value)}/>
          </div>
        </div>
      </form>}
    </div>
  )
}

export default GenericReferralForm
