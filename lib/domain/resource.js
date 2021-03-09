class Resource {
  constructor({
    id,
    name,
    description,
    websites = [],
    address,
    postcode,
    tags = [],
    telephone,
    coordinates,
    email,
    referralContact,
    referralWebsite,
    categoryId,
    serviceDescription,
    categoryName
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websites = websites;
    this.address = address;
    this.postcode = postcode;
    this.tags = tags;
    this.telephone = telephone;
    this.coordinates = coordinates;
    this.email = email;
    this.referralContact = referralContact;
    this.referralWebsite = referralWebsite;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.serviceDescription = serviceDescription;
  }
}

export default Resource;
