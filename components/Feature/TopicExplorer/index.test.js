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
        { prompt: 'topic one', promptTags: ['One', 'All'] },
        { prompt: 'topic two', promptTags: ['Two', 'Second', 'All'] },
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

  describe('with topics with tags and further info', () => {
    beforeEach(() => {
      var topics = [
        {
          prompt: 'topic one',
          supportingInformation: 'support info one',
          promptTags: ['One']
        },
        {
          prompt: 'topic two',
          supportingInformation: 'support info two',
          promptTags: ['Two']
        },
      ]

      render(<TopicExplorer topics={topics}/>);
    });

    it('shows no results initially', () => {
      expect(screen.queryByText('Conversational prompts')).toBeNull();
      expect(screen.queryByText('topic one')).toBeNull();
      expect(screen.queryByText('topic two')).toBeNull();
    });

    it('searching for a tag shows all the related info', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'one' },
      });

      expect(screen.getByText('topic one')).toBeInTheDocument
      expect(screen.getByText('support info one')).toBeInTheDocument
    });
  });

  describe('with markdown-formatted further info', () => {
    beforeEach(() => {
      var topics = [
        {
          prompt: 'topic one',
          supportingInformation: "[click me](https://example.path/)",
          promptTags: ['One']
        }
      ]

      render(<TopicExplorer topics={topics}/>);
    });

    it('shows links', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'one' },
      });

      expect(screen.getByRole('link')).toHaveTextContent('click me')
      expect(screen.getByText('click me').href).toBe('https://example.path/')
    });
  });
});
