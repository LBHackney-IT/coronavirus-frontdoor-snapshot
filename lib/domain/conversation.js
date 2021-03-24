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
    services,
    userName,
    userOrganisation,
    userEmail,
    signPostingMessage,
    systemIds,
    created,
    resident,
    user,
    emails,
    id
  }) {
    this.id = id;
    this.emails = emails;
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
    this.services = services;
    this.systemIds = systemIds;
    this.signPostingMessage = signPostingMessage;
  }
}

// ({
//   resident: {
//     firstName,
//     lastName,
//     phone,
//     email,
//     address,
//     postcode,
//     dateOfBirth
//   },
//   user: {
//     name: userName,
//     organisation: userOrganisation,
//     email: userEmail
//   },
//   services: services,
//   signPostingMessage: signPostingMessage,
//   id: undefined,
//   systemIds: undefined,
//   created: expect.any(String)
// });
