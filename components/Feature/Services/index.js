import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';

const Services = ({
  resources,
  taxonomies,
  residentFormCallback,
  referralCompletion,
  setReferralCompletion,
  updateSignpostSummary,
  referrerData,
  setReferrerData
}) => {
  const [openReferralForm, setOpenReferralForm] = useState({});
  const [referralData, setReferralData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  //filters out taxonomies with no resources
  const taxonomiesToRender = taxonomies.filter(taxonomy =>
    resources.some(resource => resource.categoryName === taxonomy.name)
  );

  //for each taxonomy only leave resources with the same category name as the taxonomy name
  taxonomiesToRender.forEach(
    taxonomy =>
      (taxonomy.resources = resources.filter(resource => taxonomy.name == resource.categoryName))
  );

  const detailsClicked = (e, id, serviceId, categoryName) => {
    e.preventDefault();
    const isOpen = document.getElementById(id).getAttribute('open');
    document.getElementsByName('refer-details').forEach(x => x.removeAttribute('open'));
    if (!isOpen) {
      document.getElementById(id).setAttribute('open', true);
      setOpenReferralForm({ id: serviceId, categoryName });
      residentFormCallback(true);
    } else {
      setOpenReferralForm({});
      residentFormCallback(false);
    }
  };

  return (
    <>
      <div className="govuk-grid-column-full-width">
        {taxonomiesToRender
          .filter(x => x.name == selectedCategory)
          .map(taxonomy => {
            return (
              <>
                {taxonomy.resources.map(resource => (
                  <ResourceCard
                    key={`resource-card-${resource.id}-${resource.name}`}
                    data-testid={`resource-${resource.id}`}
                    {...resource}
                    updateSelectedResources={() => {}}
                    categoryId={taxonomy.id}
                    referralCompletion={referralCompletion}
                    setReferralCompletion={setReferralCompletion}
                    detailsClicked={detailsClicked}
                    openReferralForm={openReferralForm}
                    referralData={referralData}
                    setReferralData={setReferralData}
                    referrerData={referrerData}
                    setReferrerData={setReferrerData}
                    updateSignpostSummary={updateSignpostSummary}
                  />
                ))}
              </>
            );
          })}
      </div>
    </>
  );
};

export default Services;
