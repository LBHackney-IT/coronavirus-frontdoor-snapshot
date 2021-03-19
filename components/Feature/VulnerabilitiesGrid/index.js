import { useEffect, useMemo, useState } from 'react';
import { Accordion, AccordionItem, Checkbox, CheckboxList, TextInput } from 'components/Form';
import ResourceCard from './ResourceCard';
import groups from './grid.json';
import helper from './vulnerabilityGridHelper';
import geoCoordinates from 'lib/api/utils/geoCoordinates';

const MAX_RESOURCES = 12;

function createLookup() {
  const lookup = new Map();

  groups.forEach(group => {
    const { name, assets, vulnerabilities } = group;
    const values = new Set(
      assets
        .concat(vulnerabilities)
        .map(item => item.label)
        .concat(group.name)
    );

    lookup.set(name, values);
  });

  return lookup;
}

const VulnerabilitiesGrid = ({
  resources,
  onUpdate,
  residentCoordinates,
  genericPostcode,
  onError,
  updateSelectedResources,
  customerId
}) => {
  const [grid, setGrid] = useState({
    assets: {},
    vulnerabilities: {},
    data: {}
  });
  const groupItems = useMemo(() => createLookup());
  const [expandedGroups, setExpandedGroups] = useState({});
  const [residentData, setResidentData] = useState(null);

  const updateSummaryResource = resourceName => {
    updateSelectedResources(resourceName);
  };
  const updateResidentData = result => {
    if (result) {
      setResidentData(result);
      onError(null);
    } else {
      let errorMsg = 'Could not find coordinates for: ' + genericPostcode;
      onError(errorMsg);
    }
  };

  const updateSelectedCheckboxes = ({ gridType, key, value }) => {
    updateGrid({
      [gridType]: grid[gridType][key]
        ? helper.removeItem({ obj: grid[gridType], key })
        : helper.addItem({ obj: grid[gridType], key, value })
    });
  };

  const updateTextData = ({ gridType, key, parentKey, label, value, inputType }) => {
    if (inputType === 'other') {
      updateGrid({
        [gridType]: value
          ? helper.addItem({ obj: grid[gridType], key, value })
          : helper.removeItem({ obj: grid[gridType], parentKey, key })
      });
    } else {
      updateGrid({
        [gridType]: value
          ? helper.addDataItem({
              obj: grid[gridType],
              key,
              value,
              label,
              parentKey
            })
          : helper.removeDataItem({ obj: grid[gridType], parentKey, key })
      });
    }
  };

  useEffect(() => {
    onUpdate({
      assets: Object.values(grid.assets)
        .filter(a => a.name !== 'Other')
        .map(a => ({ ...a, data: Object.values(a.data) })),
      vulnerabilities: Object.values(grid.vulnerabilities)
        .filter(v => v.name !== 'Other')
        .map(v => ({ ...v, data: Object.values(v.data) }))
    });

    // will re-render when the genericPostcode is changed
    if (genericPostcode) {
      geoCoordinates(genericPostcode).then(updateResidentData);
    } else {
      residentCoordinates.then(updateResidentData);
    }
  }, [grid, genericPostcode]);

  const updateGrid = patch => setGrid(grid => ({ ...grid, ...patch }));

  const labelToId = label =>
    label
      .replace(/ /g, '-')
      .replace(/\//g, '-')
      .toLowerCase();

  const filterResources = groupName => {
    const group = groupItems.get(groupName);
    const targets = Object.values({
      ...grid.assets,
      ...grid.vulnerabilities
    })
      .filter(item => group.has(item.name))
      .map(item => item.name);

    let rankedArray = [];
    resources.map(resource => {
      let matches = helper.findArrayMatches(resource.tags, targets);
      if (matches.length > 0 || resource.tags.includes(groupName)) {
        resource.distance = helper.calculateResourceDistance(resource.coordinates, residentData);
        resource.matches = matches.length;
        rankedArray.push(resource);
      }
    });
    let sortedArray = helper.sortArrayByMatches(rankedArray);
    return sortedArray ? sortedArray.slice(0, MAX_RESOURCES) : [];
  };

  const setAllExpandedGroups = () => {
    const expanded = Object.values(expandedGroups);
    const allExpanded = expanded.every(Boolean) && expanded.length === groups.length;

    setExpandedGroups(
      groups.reduce((acc, curr) => {
        acc[curr.id] = !allExpanded;
        return acc;
      }, {})
    );
  };

  return (
    <>
      <div className="govuk-grid-column-full-width">
        <Accordion
          title=""
          handleExpanded={() => {
            setAllExpandedGroups();
          }}>
          {groups.map(({ id, name, assets, vulnerabilities }) => {
            const hasSelectedVulnerabilities = Object.keys(grid.vulnerabilities).some(key =>
              key.startsWith(id)
            );
            const hasSelectedAssets = Object.keys(grid.assets).some(key => key.startsWith(id));
            return (
              <AccordionItem
                key={id}
                id={id}
                heading={name}
                hasSelectedVulnerabilities={hasSelectedVulnerabilities}
                hasSelectedAssets={hasSelectedAssets}
                onClick={expanded =>
                  setExpandedGroups({
                    ...expandedGroups,
                    [id]: expandedGroups[id] !== undefined ? !expandedGroups[id] : expanded
                  })
                }>
                <div className="govuk-grid-row">
                  <div className="align-center">
                    <CheckboxList
                      className="vulnerability"
                      resource={id}
                      checkboxType="vulnerability">
                      {vulnerabilities.map(({ arialabel, label, textinputs }) => {
                        const cbId = `${id}-v-${labelToId(label)}`;
                        return (
                          <React.Fragment key={cbId}>
                            <Checkbox
                              label={label}
                              name={cbId}
                              onClick={() =>
                                updateSelectedCheckboxes({
                                  gridType: 'vulnerabilities',
                                  key: cbId,
                                  value: label
                                })
                              }
                              aria-label={arialabel}
                              aria-expanded={
                                textinputs
                                  ? grid.vulnerabilities[cbId]
                                    ? 'true'
                                    : 'false'
                                  : undefined
                              }
                            />
                            {textinputs && grid.vulnerabilities[cbId] && (
                              <div aria-live="polite">
                                {textinputs.map(({ label, type }) => {
                                  const inputId = `${cbId}-${labelToId(label)}-i`;
                                  return (
                                    <TextInput
                                      key={inputId}
                                      name={inputId}
                                      label={label}
                                      onChange={value =>
                                        updateTextData({
                                          key: inputId,
                                          value,
                                          label,
                                          parentKey: cbId,
                                          inputType: type,
                                          gridType: 'vulnerabilities'
                                        })
                                      }
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </CheckboxList>
                  </div>
                  <div>
                    <CheckboxList className="asset" resource={id} checkboxType={'asset'}>
                      {assets.map(({ arialabel, label, textinputs }) => {
                        const cbId = `${id}-a-${labelToId(label)}`;

                        return (
                          <React.Fragment key={cbId}>
                            <Checkbox
                              label={label}
                              name={cbId}
                              onClick={() =>
                                updateSelectedCheckboxes({
                                  gridType: 'assets',
                                  key: cbId,
                                  value: label
                                })
                              }
                              aria-label={arialabel}
                              aria-expanded={
                                textinputs ? (grid.assets[cbId] ? 'true' : 'false') : undefined
                              }
                            />
                            {textinputs && grid.assets[cbId] && (
                              <div aria-live="polite">
                                {textinputs.map(({ label, type }) => {
                                  const inputId = `${cbId}-${labelToId(label)}-i`;

                                  return (
                                    <TextInput
                                      name={inputId}
                                      key={inputId}
                                      label={label}
                                      onChange={value =>
                                        updateTextData({
                                          key: inputId,
                                          value,
                                          label,
                                          parentKey: cbId,
                                          inputType: type,
                                          gridType: 'assets'
                                        })
                                      }
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </CheckboxList>
                  </div>
                </div>

                <div className="govuk-grid-column-full-width govuk-!-padding-top-5">
                  {
                    <div key={`${id}-resources`}>
                      {expandedGroups[id] &&
                        filterResources(name).map(resource => {
                          return (
                            <ResourceCard
                              key={resource.id}
                              data-testid={`resource-${resource.id}`}
                              {...resource}
                              updateSelectedResources={updateSummaryResource}
                              customerId={customerId}
                              referralCompletion={{}}
                              setReferralCompletion={() => {}}
                              detailsClicked={null}
                              openReferralForm={() => {}}
                              referralData={{}}
                              setReferralData={() => {}}
                            />
                          );
                        })}
                    </div>
                  }
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
};

export default VulnerabilitiesGrid;
