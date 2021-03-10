import { IsoDateTime } from './isodate';

export default class Snapshot {
  constructor({
    id,
    created,
    createdBy,
    dob,
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes
  }) {
    this.id = id;
    this.created = created ? created : IsoDateTime.now();
    this.createdBy = createdBy;
    this.dob = dob;
    this.firstName = firstName;
    this.postcode = postcode;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.referralReason = referralReason;
    this.conversationNotes = conversationNotes;
  }

  // dynamodb ttl
  expires;
}
