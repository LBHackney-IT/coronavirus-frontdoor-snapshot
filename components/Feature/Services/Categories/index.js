import CategoryCard from './CategoryCard';

const Categories = ({ categorisedResources, setSelectedCategory }) => {
  const splitArrayIntoChunksOfLen = (arr, len) => {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  };

  const groupedCategories = splitArrayIntoChunksOfLen(categorisedResources, 3);
  return (
    <div className="govuk-width-container">
      {groupedCategories.map(group => {
        return (
          <div className={`govuk-grid-row`}>
            {group.map(taxonomy => {
              return (
                <div className="govuk-grid-column-one-third">
                  <CategoryCard category={taxonomy} onclick={setSelectedCategory}></CategoryCard>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
