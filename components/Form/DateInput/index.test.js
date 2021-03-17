import { fireEvent, render } from '@testing-library/react';
import DateInput from './index';

describe('DateInput', () => {
  const inputName = 'my-date';

  it('renders the day input', () => {
    const { getByLabelText } = render(<DateInput name={inputName} />);
    const dayInput = getByLabelText(/\s*Day\s*/);

    expect(dayInput).toBeInTheDocument();
    expect(dayInput.id).toEqual(`${inputName}-day`);
    expect(dayInput.name).toEqual(`${inputName}-day`);
  });

  it('renders the month input', () => {
    const { getByLabelText } = render(<DateInput name={inputName} />);
    const monthInput = getByLabelText(/\s*Month\s*/);

    expect(monthInput).toBeInTheDocument();
    expect(monthInput.id).toEqual(`${inputName}-month`);
    expect(monthInput.name).toEqual(`${inputName}-month`);
  });

  it('renders the year input', () => {
    const { getByLabelText } = render(<DateInput name={inputName} />);
    const yearInput = getByLabelText(/\s*Year\s*/);

    expect(yearInput).toBeInTheDocument();
    expect(yearInput.id).toEqual(`${inputName}-year`);
    expect(yearInput.name).toEqual(`${inputName}-year`);
  });

  it('renders a title', () => {
    const inputTitle = 'My Date';
    const { getByText } = render(<DateInput name={inputName} title={inputTitle} />);
    const title = getByText(inputTitle);

    expect(title).toBeInTheDocument();
  });

  it('renders a hint if showHint is true', () => {
    const { container } = render(<DateInput name={inputName} showHint={true} />);
    const hint = container.querySelector(`#${inputName}-hint`);

    expect(hint).toBeInTheDocument();
  });

  it('does not render a hint if showHint is falsy', () => {
    const { container } = render(<DateInput name={inputName} />);
    const hint = container.querySelector(`#${inputName}-hint`);

    expect(hint).not.toBeInTheDocument();
  });

  it('performs an action onChange', () => {
    let day = -1;
    let month = -1;
    let year = -1;
    const myAction = jest.fn(e => {
      if (e.target.name.includes('day')) day = e.target.value;
      if (e.target.name.includes('month')) month = e.target.value;
      if (e.target.name.includes('year')) year = e.target.value;
    });
    const { getByLabelText } = render(<DateInput name={inputName} onChange={myAction} />);

    fireEvent.change(getByLabelText(/\s*Day\s*/), {
      target: { value: 12 }
    });
    fireEvent.change(getByLabelText(/\s*Month\s*/), {
      target: { value: 10 }
    });
    fireEvent.change(getByLabelText(/\s*Year\s*/), {
      target: { value: 2021 }
    });

    expect(day).toEqual('12');
    expect(month).toEqual('10');
    expect(year).toEqual('2021');
  });

  it('shows an error message if validation is required and day is empty', () => {
    const { container, getByLabelText } = render(<DateInput name={inputName} validate={true} />);
    fireEvent.change(getByLabelText(/\s*Day\s*/), {
      target: { value: '' }
    });
    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('shows an error message if validation is required and month is empty', () => {
    const { container, getByLabelText } = render(<DateInput name={inputName} validate={true} />);
    fireEvent.change(getByLabelText(/\s*Month\s*/), {
      target: { value: '' }
    });
    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('shows an error message if validation is required and year is empty', () => {
    const { container, getByLabelText } = render(<DateInput name={inputName} validate={true} />);
    fireEvent.change(getByLabelText(/\s*Year\s*/), {
      target: { value: '' }
    });
    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('shows an error message if validation is required and date is invalid', () => {
    const { container, getByLabelText } = render(
      <DateInput
        name={inputName}
        validate={true}
        onChange={() => {}}
        day={99}
        month={10}
        year={2021}
      />
    );
    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('shows an error message if validation is required and date is in the past', () => {
    const { container, getByLabelText } = render(
      <DateInput
        name={inputName}
        validate={true}
        onChange={() => {}}
        day={10}
        month={10}
        year={1999}
      />
    );
    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('does not show an error message if validation is required and date is all good', () => {
    const { container, getByLabelText } = render(
      <DateInput
        name={inputName}
        validate={true}
        onChange={() => {}}
        day={10}
        month={10}
        year={2030}
      />
    );

    expect(container.querySelector('.govuk-error-message')).not.toBeInTheDocument();
  });

  it('sets the day input value', () => {
    const { getByLabelText } = render(<DateInput day={20} />);
    expect(getByLabelText(/\s*Day\s*/).value).toEqual('20');
  });

  it('sets the month input value', () => {
    const { getByLabelText } = render(<DateInput month={10} />);
    expect(getByLabelText(/\s*Month\s*/).value).toEqual('10');
  });

  it('sets the year input value', () => {
    const { getByLabelText } = render(<DateInput year={2030} />);
    expect(getByLabelText(/\s*Year\s*/).value).toEqual('2030');
  });
});
