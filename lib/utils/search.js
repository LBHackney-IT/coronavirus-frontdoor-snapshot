const getSearchResults = (searchTerm, items) => {
  let filteredItems = [];
  items.forEach(item => {
    let newItem = item;
    newItem.resources = newItem.resources.filter(resource =>
      resource.description.includes(searchTerm)
    );
    filteredItems.push(newItem);
  });
  return filteredItems;
};

export { getSearchResults };
