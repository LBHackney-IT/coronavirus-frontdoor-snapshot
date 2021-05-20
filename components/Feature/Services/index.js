import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import { Accordion, AccordionItem } from 'components/Form';

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
  const [expandedGroups, setExpandedGroups] = useState({});
  const [openReferralForm, setOpenReferralForm] = useState({});
  const [referralData, setReferralData] = useState({});

  const taxonomiesToRender = taxonomies.filter(taxonomy =>
    resources.some(resource => resource.categoryName === taxonomy.name)
  );

  taxonomiesToRender.forEach(
    taxonomy =>
      (taxonomy.resources = resources.filter(resource => taxonomy.name == resource.categoryName))
  );

  const [tax, setTax] = useState(taxonomiesToRender);

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

  const handleSearch = e => {
    e.preventDefault();
    const searchTerm = e.target['search-input'].value;

    const newTax = taxonomiesToRender.map(x => {
      let newResources = x.resources.filter(z => {
        return Object.values(z)
          .flat()
          .some(k => {
            return k.toString().includes(searchTerm);
          });
      });
      return { ...x, resources: newResources };
    });
    setTax(newTax);
  };
  return (
    <>
      <div className="govuk-grid-column-full-width">
        <form onSubmit={handleSearch}>
          <input
            id="topic-search"
            list="input-tags"
            type="text"
            name="search-input"
            className="govuk-input govuk-input--width-20"
          />
          <button type="submit" className="govuk-button" data-testid="cookies-yes-button">
            Search
          </button>
        </form>
        <Accordion title="">
          {tax.map(taxonomy => {
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
