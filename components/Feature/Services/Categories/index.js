import CategoryCard from './CategoryCard';
import styles from './index.module.scss';

const Categories = ({ categorisedResources, clickCategory, selectedCategory }) => {
  let groupedCategories = [];
  let i = 0;
  while (i < categorisedResources.length) {
    groupedCategories.push(categorisedResources.slice(i, (i += 3)));
  }

  return (
    <div>
      {groupedCategories.map((group, i) => {
        return (
          <div key={`category-group-${i}`} className={`govuk-grid-row ${styles['row']}`}>
            {group.map(taxonomy => {
              return (
                <div
                  key={`category-card-${taxonomy.name}`}
                  className={`govuk-grid-column-one-third ${styles['column']}`}>
                  <CategoryCard
                    category={taxonomy}
                    onclick={clickCategory}
                    selectedCategory={selectedCategory}></CategoryCard>
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
