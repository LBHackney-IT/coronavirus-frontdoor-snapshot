import { render, screen, fireEvent } from '@testing-library/react';
import TopicExplorer from './index';

describe('TopicExplorer', () => {
  describe('renders successfully with props', () => {
    var topics = [
      { prompt: 'topic one', tags: ['one'] },
      { prompt: 'topic two', tags: ['two', 'second'] },
    ]

    it('renders successfully', () => {
      render(<TopicExplorer topics={topics}/>);
      expect(screen.getByText('How can we help?')).toBeInTheDocument();
    });

    it('shows no results for a tag that does not exist', () => {
      render(<TopicExplorer topics={topics}/>);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'giraffe' },
      });

      expect(screen.queryByText('topic one')).toBeNull();
      expect(screen.queryByText('Conversational prompts')).toBeNull();
      expect(screen.getByText('No results for "giraffe"')).toBeInTheDocument();
    });

    it('shows results for the first topic', () => {
      render(<TopicExplorer topics={topics}/>);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'one' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
    });

    it('shows results for the second topic', () => {
      render(<TopicExplorer topics={topics}/>);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'two' },
      });

      expect(screen.getByText('topic two')).toBeInTheDocument
    });

    it('shows results searching for any matching tag', () => {
      render(<TopicExplorer topics={topics}/>);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'second' },
      });

      expect(screen.getByText('topic two')).toBeInTheDocument
    });

    it('shows all results for a matching tag', () => {
      var topics = [
        { prompt: 'topic one', tags: ['one', 'all'] },
        { prompt: 'topic two', tags: ['two', 'all'] },
      ]

      render(<TopicExplorer topics={topics}/>);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'all' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
      expect(screen.getByText('topic two')).toBeInTheDocument
    });
  });
})
