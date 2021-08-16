const Categories = ({ categorisedResources, selectedCategories, setSelectedCategories }) => {
  const categoryProblems = {
    'Loneliness or isolation': { problemDescription: 'Loneliness or isolation' },
    'Anxiety or mental health': { problemDescription: 'Mental health' },
    'Exercise and wellbeing': { problemDescription: 'Exercise' },
    'Safe and healthy body': {
      problemDescription: 'Medical conditions, addictions or safety concerns'
    },
    'Arts and creativity': { problemDescription: 'Emotional wellbeing' },
    'Food or shopping': { problemDescription: 'Food or shopping' },
    'Money advice': { problemDescription: 'Money' },
    'Employment advice': { problemDescription: 'Employment' },
    'Housing advice': { problemDescription: 'Housing' },
    'Immigration advice': { problemDescription: 'Immigration' }
  };

  const categoryChanged = e => {
    let ids = selectedCategories;
    ids = ids.filter(item => item !== e.target.value);
    if (e.target.checked) ids.push(e.target.value);
    setSelectedCategories(ids);
  };

  return (
    <div>
      {categorisedResources
        .filter(c => categoryProblems[c.name])
        .map(group => {
          return (
            <div class="govuk-checkboxes__item">
              <input
                class="govuk-checkboxes__input"
                id={`category-cb-${group.id}`}
                name={`category-cb-${group.id}`}
                type="checkbox"
                onChange={e => categoryChanged(e)}
                value={group.id}
              />
              <label class="govuk-label govuk-checkboxes__label" for={`category-cb-${group.id}`}>
                {categoryProblems[group.name].problemDescription}
              </label>
            </div>
          );
        })}
    </div>
  );
};

export default Categories;
