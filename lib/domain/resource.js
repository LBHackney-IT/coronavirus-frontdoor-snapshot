class Resource {
  constructor({ id, name, description, websites = [], address, postcode, tags = [], telephone, coordinates,
    openingTimes, currentProvision, email, referralContact, selfReferral, notes, supportingInformation, prompts, promptTags =[] }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websites = websites;
    this.address = address;
    this.postcode = postcode;
    this.tags = tags;
    this.telephone = telephone;
    this.coordinates = coordinates;
    this.openingTimes = openingTimes;
    this.currentProvision = currentProvision;
    this.email = email;
    this.referralContact = referralContact;
    this.selfReferral = selfReferral;
    this.notes = notes;
    this.supportingInformation = supportingInformation;
    this.prompts = prompts;
    this.promptTags = promptTags
  }
}

export default Resource;
