import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import { Accordion, AccordionItem } from 'components/Form';

const Services = ({ resources, taxonomies }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  taxonomies.forEach(
    taxonomy =>
      (taxonomy.resources = resources
        .map(resource => {
          if (taxonomy.name == resource.categoryName) return resource;
        })
        .filter(x => x))
  );
  return (
    <>
      <div className="govuk-grid-column-full-width">
        <Accordion title="">
          {taxonomies.map(taxonomy => {
            return (
              <>
                {taxonomy.resources.length > 0 && (
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
                      />
                    ))}
                  </AccordionItem>
                )}
              </>
            );
          })}
        </Accordion>
      </div>
    </>
  );
};

export default Services;
