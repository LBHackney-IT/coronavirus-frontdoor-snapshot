import { useState } from 'react';
import ResourceCard from 'components/Feature/VulnerabilitiesGrid/ResourceCard';
import {
  Accordion,
  AccordionItem
} from 'components/Form';

const Services = ({ resources, taxonomies }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  return (
    <>
      <div className="govuk-grid-column-full-width">
        <Accordion
          title=""
        >
          {taxonomies.map(taxonomy => {
            return (
              <>
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
                  {resources.map(
                    resource =>
                      taxonomy.name == resource.categoryName && (
                        <ResourceCard
                          key={`resource-card-${resource.id}-${resource.name}`}
                          data-testid={`resource-${resource.id}`}
                          {...resource}
                          updateSelectedResources={() => {}}
                        />
                      )
                  )}
                </AccordionItem>
              </>
            );
          })}
        </Accordion>
      </div>
    </>
  );
};

export default Services;
