const Categories = ({ categorisedResources, selectedCategories, setSelectedCategories }) => {
  const categoryProblems = {
    'Anxiety or mental health': { problemDescription: 'Mental health' },
    'Exercise and wellbeing': { problemDescription: 'Exercise' },
    'Safe and healthy body': {
      problemDescription: 'Medical conditions, addictions or safety concerns'
    },
    'Arts and creativity': { problemDescription: 'Emotional wellbeing' },
    'Money advice': { problemDescription: 'Money' },
    'Employment advice': { problemDescription: 'Employment' },
    'Housing advice': { problemDescription: 'Housing' },
    'Immigration advice': { problemDescription: 'Immigration' },
    'Faith-led activities': { problemDescription: 'Religious needs' }
  };

  const categoryChanged = e => {
    let selectedCategoryIds = selectedCategories;
    const changedCategoryId = e.target.value;
    selectedCategoryIds = selectedCategoryIds.filter(item => item !== changedCategoryId);
    if (e.target.checked && changedCategoryId) {
      selectedCategoryIds.push(changedCategoryId);
    }
    setSelectedCategories(selectedCategoryIds);
  };

  return (
    <div>
      {categorisedResources.map(group => {
        return (
          <div class="govuk-checkboxes__item">
            <input
              class="govuk-checkboxes__input"
              id={`category-cb-${group.id}`}
              name={`category-cb-${group.id}`}
              type="checkbox"
              data-testid="category-checkbox"
              onChange={e => categoryChanged(e)}
              value={group.name}
            />
            <label
              class="govuk-label govuk-checkboxes__label"
              for={`category-cb-${group.id}`}
              data-testid="category-label">
              {categoryProblems[group.name]
                ? categoryProblems[group.name].problemDescription
                : group.name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
