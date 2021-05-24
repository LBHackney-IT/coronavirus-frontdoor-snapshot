import CategoryCard from './CategoryCard';

const Categories = ({ categorisedResources, setSelectedCategory }) => {
  let groupedCategories = [];
  let i = 0;
  while (i < categorisedResources.length) {
    groupedCategories.push(categorisedResources.slice(i, (i += 3)));
  }

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
