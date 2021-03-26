import { fireEvent, render } from '@testing-library/react';
import VulnerabilitiesGrid from './index';
import groups from './grid.json';
import { act } from 'react-dom/test-utils';

describe('VulnerabilitiesGrid', () => {
  const resources = [];
  const residentCoordinates = Promise.resolve({ data: {} });

  it('renders the vulnerabilities grid', () => {
    const numberOfGroups = groups.length;
    const totalAssets = groups.reduce((total, g) => {
      return total + g.assets.length;
    }, 0);
    const totalVulnerabilities = groups.reduce((total, g) => {
      return total + g.vulnerabilities.length;
    }, 0);

    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={jest.fn()}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    expect(container.querySelectorAll('.govuk-accordion__section').length).toEqual(numberOfGroups);
    expect(container.querySelectorAll('.govuk-checkboxes__item').length).toEqual(
      totalAssets + totalVulnerabilities
    );
  });

  it('updates the grid state when a vulnerability is checked', async () => {
    const onUpdate = jest.fn();
    const expected = expect.objectContaining({
      assets: [],
      vulnerabilities: [{ name: 'Halal', data: [] }]
    });

    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={onUpdate}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    act(() => container.querySelector('.govuk-checkboxes__input').click());
    expect(onUpdate).toHaveBeenCalledWith(expected);
  });

  it('creates a textinput when checkbox is checked', () => {
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={jest.fn()}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector('#financial-stability-a-other'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    expect(container.querySelector('#financial-stability-a-other--i')).toBeInTheDocument();
  });

  it('saves "Other" assets', () => {
    const onUpdate = jest.fn();
    const expected = expect.objectContaining({
      assets: [{ name: 'some text', data: [] }],
      vulnerabilities: []
    });
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={onUpdate}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector('#financial-stability-a-other'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    fireEvent.change(container.querySelector('#financial-stability-a-other--i'), {
      target: { value: 'some text' }
    });

    expect(onUpdate).toHaveBeenCalledWith(expected);
  });

  it('saves "Other" vulnerabilities', () => {
    const onUpdate = jest.fn();
    const expected = expect.objectContaining({
      assets: [],
      vulnerabilities: [{ data: [], name: 'some text' }]
    });
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={onUpdate}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector('#financial-stability-v-other'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    fireEvent.change(container.querySelector('#financial-stability-v-other--i'), {
      target: { value: 'some text' }
    });

    expect(onUpdate).toHaveBeenCalledWith(expected);
  });

  it('creates text inputs when active case checkbox is checked', () => {
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={jest.fn()}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)'
      ),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    expect(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-service-i'
      )
    ).toBeInTheDocument();

    expect(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-contact-name-i'
      )
    ).toBeInTheDocument();

    expect(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-phone-number-i'
      )
    ).toBeInTheDocument();
  });

  it('saves "Active case" vulnerability text inputs', () => {
    const onUpdate = jest.fn();
    const expected = expect.objectContaining({
      assets: [],
      vulnerabilities: [
        {
          data: [
            {
              label: 'Service',
              value: 'test'
            }
          ],
          name: 'Active case with other services (e.g. Adult Social Care, Childrens)'
        }
      ]
    });
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={onUpdate}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)'
      ),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    fireEvent.change(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-service-i'
      ),
      {
        target: { value: 'test' }
      }
    );

    expect(onUpdate).toHaveBeenCalledWith(expected);
  });

  it('does not save the input if it is deleted', () => {
    const onUpdate = jest.fn();
    const expected = expect.objectContaining({
      assets: [],
      vulnerabilities: [
        {
          data: [],
          name: 'Active case with other services (e.g. Adult Social Care, Childrens)'
        }
      ]
    });
    const { container } = render(
      <VulnerabilitiesGrid
        onUpdate={onUpdate}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    fireEvent(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)'
      ),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    fireEvent.change(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-service-i'
      ),
      {
        target: { value: 'test' }
      }
    );

    fireEvent.change(
      container.querySelector(
        '#support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)-service-i'
      ),
      {
        target: { value: '' }
      }
    );

    expect(onUpdate).toHaveBeenCalledWith(expected);
  });

  describe('resources', () => {
    it('shows links to resources tagged with current selections', () => {
      const resources = [
        {
          id: 'hq',
          name: 'Hackney Quest',
          description:
            'We provide mentoring for young people and families over the phone or by video call.',
          websites: ['https://twitter.com/HackneyQuest'],
          address: '1 Poole Rd, London E9 7AE',
          postcode: 'E9 7AE',
          tags: ['Social isolation'],
          coordinates: '51.5365,-0.0802',
          councilTags: []
        }
      ];

      const { getByLabelText, queryByTestId } = render(
        <VulnerabilitiesGrid
          onUpdate={jest.fn()}
          onError={jest.fn()}
          resources={resources}
          residentCoordinates={residentCoordinates}
        />
      );

      expect(queryByTestId('resource-hq')).not.toBeInTheDocument();
      act(() => {
        queryByTestId('relationships-and-support-network').click();
        getByLabelText('Social isolation').click();
      });
      expect(queryByTestId('resource-hq')).toBeInTheDocument();
    });
  });

  it('shows links to resources tagged with current group', () => {
    const resources = [
      {
        id: 'hs',
        name: 'Hackney Shine',
        description: 'We offer free online and over the phone advice service to ...',
        websites: ['https://hackney.gov.uk/shine'],
        tags: ['Financial stability'],
        councilTags: []
      }
    ];

    const { getByLabelText, queryByTestId } = render(
      <VulnerabilitiesGrid
        onUpdate={jest.fn()}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    expect(queryByTestId('resource-hs')).not.toBeInTheDocument();

    act(() => {
      queryByTestId('financial-stability').click();
      getByLabelText('Rent arrears').click();
    });
    expect(queryByTestId('resource-hs')).toBeInTheDocument();
  });

  it('does not show a resource if accordion is collapsed', () => {
    const resources = [
      {
        id: 'hs',
        name: 'Hackney Shine',
        description: 'We offer free online and over the phone advice service to ...',
        websites: ['https://hackney.gov.uk/shine'],
        tags: ['Financial stability']
      }
    ];

    const { getByLabelText, queryByTestId } = render(
      <VulnerabilitiesGrid
        onUpdate={jest.fn()}
        onError={jest.fn()}
        resources={resources}
        residentCoordinates={residentCoordinates}
      />
    );

    expect(queryByTestId('resource-hs')).not.toBeInTheDocument();

    act(() => getByLabelText('Rent arrears').click());
    expect(queryByTestId('resource-hs')).not.toBeInTheDocument();
  });
});
