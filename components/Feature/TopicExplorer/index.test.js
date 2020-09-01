import { render, screen, fireEvent } from '@testing-library/react';
import TopicExplorer from './index';

describe('TopicExplorer', () => {
  describe('renders successfully with props', () => {
    var topics = [
      { prompt: 'topic one', tags: ['one, 1, first'] },
      { prompt: 'topic two', tags: ['two, 2, second'] },
    ]

    render(<TopicExplorer topics={topics}/>);

    it('renders successfully', () => {
      expect(screen.getByText('Conversational prompts')).toBeInTheDocument();
    });

    describe('with a search for topic one', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'one' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
    });

    xdescribe('with a search for topic two', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'two' },
      });

      expect(screen.getByText('topic two')).toBeInTheDocument
    });
  });
})
