import { fireEvent, render } from '@testing-library/react';
import TextArea from './index';

describe('TextArea', () => {
  it('renders a text area', () => {
    const inputName = 'input-name';
    const inputLabel = 'label';

    const { getByLabelText } = render(<TextArea name={inputName} label={inputLabel} />);

    const input = getByLabelText(inputLabel);
    expect(input).toBeInTheDocument();
    expect(input.id).toEqual(inputName);
    expect(input.name).toEqual(inputName);
  });

  it('calls onChange with the new value', () => {
    const onChange = jest.fn();

    const { getByLabelText } = render(<TextArea name="x" label="x" onChange={onChange} />);
    fireEvent.change(getByLabelText('x'), {
      target: { value: 'hello' }
    });

    expect(onChange).toHaveBeenCalledWith('hello');
  });
});
