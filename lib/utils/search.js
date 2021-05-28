const getSearchResults = (searchTerm, items) => {
  let words = searchTerm.split(' ');

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(
      resource =>
        resource.description.includes(searchTerm) ||
        words.some(word => resource.description.includes(word))
    );

    return item;
  });
};

export { getSearchResults };
