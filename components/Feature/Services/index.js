import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import { Accordion, AccordionItem } from 'components/Form';

const Services = ({ resources, taxonomies, refererInfo }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const taxonomiesToRender = taxonomies.filter(taxonomy =>
    resources.some(resource => resource.categoryName === taxonomy.name)
  );

  taxonomiesToRender.forEach(
    taxonomy =>
      (taxonomy.resources = resources.filter(
        resource => taxonomy.name == resource.categoryName
      ))
  );

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
                    }
                  >
                    {taxonomy.resources.map(resource => (
                      <ResourceCard
                        key={`resource-card-${resource.id}-${resource.name}`}
                        data-testid={`resource-${resource.id}`}
                        {...resource}
                        updateSelectedResources={() => {}}
                        refererInfo={refererInfo}
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
