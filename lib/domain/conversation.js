import { IsoDateTime } from './isodate';

export default class Conversation {
  constructor({
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    dateOfBirth,
    discussedServices,
    userName,
    userOrganisation,
    userEmail,
    signPostingMessage,
    systemIds,
    created,
    resident,
    user,
    emails,
    letters,
    id
  }) {
    this.id = id;
    this.emails = emails;
    this.letters = letters;
    this.created = created ? created : IsoDateTime.now();
    this.resident = resident
      ? resident
      : {
          firstName,
          lastName,
          phone,
          email,
          address,
          postcode,
          dateOfBirth
        };
    this.user = user
      ? user
      : {
          name: userName,
          organisation: userOrganisation,
          email: userEmail
        };
    this.discussedServices = discussedServices;
    this.systemIds = systemIds;
    this.signPostingMessage = signPostingMessage;
  }
}
