import { fireEvent, render } from '@testing-library/react';
import TextInput from './index';

describe('TextInput', () => {
  it('renders a text input', () => {
    const inputName = 'my-text-input';
    const inputLabel = 'My Input';
    const { getByLabelText } = render(<TextInput name={inputName} label={inputLabel} />);

    const labelRegex = new RegExp(`\s*${inputLabel}\s*`);
    const input = getByLabelText(labelRegex);

    expect(input).toBeInTheDocument();
    expect(input.id).toEqual(inputName);
    expect(input.name).toEqual(inputName);
  });

  it('performs an action onChange', () => {
    const myAction = jest.fn();
    const { getByLabelText } = render(
      <TextInput name={'my-input'} label={'My Input'} onChange={myAction} />
    );

    fireEvent.change(getByLabelText(/\s*My Input\s*/), {
      target: { value: 'hello' }
    });

    expect(myAction).toHaveBeenCalledWith('hello');
  });

  it('shows an error message if validation is required and input has no value', () => {
    const inputLabel = 'My Input';
    const { container, getByLabelText } = render(
      <TextInput name="my-text-input" label={inputLabel} validate={true} />
    );

    fireEvent.change(getByLabelText(inputLabel), {
      target: { value: '' }
    });

    expect(container.querySelector('.govuk-error-message')).toBeInTheDocument();
  });

  it('does not show error message if validation is required and input has a value', () => {
    const inputLabel = 'My Input';
    const { container, getByLabelText } = render(
      <TextInput
        name="my-text-input"
        label={inputLabel}
        onChange={() => {}}
        validate={true}
        value="hello"
      />
    );

    expect(container.querySelector('.govuk-error-message')).not.toBeInTheDocument();
  });

  it('sets the input value', () => {
    const inputLabel = 'My Input';
    const { getByLabelText } = render(
      <TextInput name="my-text-input" label={inputLabel} onChange={() => {}} value={'hello'} />
    );
    expect(getByLabelText(inputLabel).value).toEqual('hello');
  });
});
