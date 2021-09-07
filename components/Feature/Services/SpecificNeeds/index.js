import { isJSON } from 'lib/utils/search';

const SpecificNeeds = ({ selectedSpecificNeeds, setSelectedSpecificNeeds }) => {
  const specificNeeds = isJSON(process.env.SEARCH_EXCLUSIONS)
    ? JSON.parse(process.env.SEARCH_EXCLUSIONS)
    : [];

  const specificNeedsLabels = specificNeeds.map(exclusion => exclusion.label).flat();

  const specificNeedsChanged = e => {
    let selectedSpecificNeedsLabels = selectedSpecificNeeds;
    const clickedSpecificNeed = e.target.value;
    selectedSpecificNeedsLabels = selectedSpecificNeedsLabels.filter(
      item => item !== clickedSpecificNeed
    );
    if (e.target.checked && clickedSpecificNeed) {
      selectedSpecificNeedsLabels.push(clickedSpecificNeed);
    }
    setSelectedSpecificNeeds(selectedSpecificNeedsLabels);
  };

  return (
    <div>
      {specificNeedsLabels.map(label => {
        return (
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id={`specific-needs-cb-${label}`}
              name={`specific-needs-cb`}
              type="checkbox"
              data-testid="specific-needs-checkbox"
              onChange={e => specificNeedsChanged(e)}
              value={label}
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor={`specific-needs-cb-${label}`}
              data-testid="specific-needs-label">
              {label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SpecificNeeds;
