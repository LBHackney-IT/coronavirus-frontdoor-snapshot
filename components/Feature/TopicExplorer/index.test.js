import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import TopicExplorer from './index';

describe('TopicExplorer', () => {
  describe('with no topics', () => {
    beforeEach(() => {
      var topics = []
      render(<TopicExplorer topics={topics}/>);
    });

    it('renders successfully', () => {
      expect(screen.getByText('How can we help?')).toBeInTheDocument();
    });

    it('shows no results for a search', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'giraffe' },
      });

      expect(screen.queryByText('Conversational prompts')).toBeNull();
      expect(screen.getByText('No results for "giraffe"')).toBeInTheDocument();
    });
  });

  describe('with tagged topics', () => {
    beforeEach(() => {
      var topics = [
        { prompt: 'topic one', tags: ['one', 'all'] },
        { prompt: 'topic two', tags: ['two', 'second', 'all'] },
      ]

      render(<TopicExplorer topics={topics}/>);
    });

    it('shows no results initially', () => {
      expect(screen.queryByText('Conversational prompts')).toBeNull();
      expect(screen.queryByText('topic one')).toBeNull();
      expect(screen.queryByText('topic two')).toBeNull();
    });

    it('searching for a tag shows a matching topic', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'one' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
    });

    it('searching for a tag shows all matching results', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'all' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
      expect(screen.getByText('topic two')).toBeInTheDocument
    });

    it('ignores case when searching', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'ONE' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
    });
  });
})
