import { IsoDateTime } from './isodate';

export default class Referral {
  constructor({
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes,
    referrerOrganisation,
    referrerName,
    referrerEmail,
    dateOfBirth,
    serviceId,
    serviceName,
    serviceContactEmail,
    serviceReferralEmail,
    serviceContactPhone,
    serviceWebsite,
    serviceDescription,
    serviceAddress,
    systemIds,
    created,
    resident,
    referrer,
    service,
    emails,
    id,
    linkId,
    referenceNumber,
    statusHistory,
    emailFromToken
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
    this.referrer = referrer
      ? referrer
      : {
          name: referrerName,
          organisation: referrerOrganisation,
          email: referrerEmail
        };
    this.referralReason = referralReason;
    this.conversationNotes = conversationNotes;
    this.service = service
      ? service
      : {
          id: serviceId,
          name: serviceName,
          contactEmail: serviceContactEmail,
          contactPhone: serviceContactPhone,
          referralEmail: serviceReferralEmail,
          address: serviceAddress,
          websites: serviceWebsite,
          description: serviceDescription
        };
    this.systemIds = systemIds;
    this.linkId = linkId;
    this.referenceNumber = referenceNumber;
    this.statusHistory = statusHistory;
    this.referredBy = emailFromToken;
  }
}
