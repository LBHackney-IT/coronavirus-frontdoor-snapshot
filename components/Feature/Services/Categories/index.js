import CategoryCard from './CategoryCard';
import styles from './index.module.scss';

const Categories = ({ categorisedResources, clickCategory }) => {
  let groupedCategories = [];
  let i = 0;
  while (i < categorisedResources.length) {
    groupedCategories.push(categorisedResources.slice(i, (i += 3)));
  }

  return (
    <div className="govuk-width-container">
      {groupedCategories.map(group => {
        return (
          <div className={`govuk-grid-row ${styles['row']}`}>
            {group.map(taxonomy => {
              return (
                <div className={`govuk-grid-column-one-third ${styles['column']}`}>
                  <CategoryCard category={taxonomy} onclick={clickCategory}></CategoryCard>
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
