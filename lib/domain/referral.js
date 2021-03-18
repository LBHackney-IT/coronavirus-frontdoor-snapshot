import { IsoDateTime } from './isodate';

export default class Referral {
  constructor({ id, created, resident, referrer, referralReason, conversationNotes, service, systemIds }) {
    this.id = id;
    this.created = created ? created : IsoDateTime.now();
    this.resident = resident;
    this.referrer = referrer;
    this.referralReason = referralReason;
    this.conversationNotes = conversationNotes;
    this.service = service;
    this.systemIds = systemIds;
  }
}
