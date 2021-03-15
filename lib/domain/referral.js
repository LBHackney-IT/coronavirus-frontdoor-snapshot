import { IsoDateTime } from './isodate';

export default class Referral {
  constructor({
    id,
    created,
    createdBy,
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes,
    referrerOrganisation,
    referrerEmail,
    dateOfBirth
  }) {
    this.id = id;
    this.created = created ? created : IsoDateTime.now();
    this.createdBy = createdBy;
    this.firstName = firstName;
    this.postcode = postcode;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.referralReason = referralReason;
    this.conversationNotes = conversationNotes;
    this.referrerOrganisation = referrerOrganisation;
    this.referrerEmail = referrerEmail;
    this.dateOfBirth = dateOfBirth;
  }

  // dynamodb ttl
  expires;
}
