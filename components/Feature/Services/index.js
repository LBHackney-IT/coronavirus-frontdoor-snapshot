import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import { Accordion, AccordionItem } from 'components/Form';

const Services = ({
  resources,
  taxonomies,
  refererInfo,
  residentFormCallback,
  referralCompletion,
  setReferralCompletion
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [openReferralForm, setOpenReferralForm] = useState({});
  const [referralData, setReferralData] = useState({
    'referer-email': refererInfo?.email,
    'referer-name': refererInfo?.name,
    'referer-organisation': refererInfo?.iss
  });
  const taxonomiesToRender = taxonomies.filter(taxonomy =>
    resources.some(resource => resource.categoryName === taxonomy.name)
  );

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
        <Accordion title="">
          {taxonomiesToRender.map(taxonomy => {
            return (
              <>
                {
                  <AccordionItem
                    key={`taxonomy-${taxonomy.id}`}
                    id={taxonomy.id}
                    heading={taxonomy.name}
                    onClick={expanded =>
                      setExpandedGroups({
                        ...expandedGroups,
                        [taxonomy.id]:
                          expandedGroups[taxonomy.id] !== undefined
                            ? !expandedGroups[taxonomy.id]
                            : expanded
                      })
                    }>
                    {taxonomy.resources.map(resource => (
                      <ResourceCard
                        key={`resource-card-${resource.id}-${resource.name}`}
                        data-testid={`resource-${resource.id}`}
                        {...resource}
                        updateSelectedResources={() => {}}
                        refererInfo={refererInfo}
                        categoryId={taxonomy.id}
                        referralCompletion={referralCompletion}
                        setReferralCompletion={setReferralCompletion}
                        detailsClicked={detailsClicked}
                        openReferralForm={openReferralForm}
                        referralData={referralData}
                        setReferralData={setReferralData}
                      />
                    ))}
                  </AccordionItem>
                }
              </>
            );
          })}
        </Accordion>
      </div>
    </>
  );
};

export default Services;
