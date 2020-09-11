import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

const TopicExplorer = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [tags, setTag] = useState([])

  const getSearchResults = (searchTerm) => {
    var results = []
    const newSearchTerm = searchTerm.toLocaleLowerCase();

    for(const topic of props.topics) {
      const promptTags = topic.promptTags

      promptTags.forEach(tag => {
        if(tag.toLocaleLowerCase() == newSearchTerm){
          results.push(topic);
        }
      });
    }

    return results
  }

  useEffect(() => {
    if (!props.topics) { return }

    if (!searchTerm) {
      setSearchResults(getSearchResults('default'))
    }

    props.topics.forEach(topic => {
      topic.promptTags.forEach(promptTag => {
        if(!tags.includes(promptTag)){
          const newTags = tags
          newTags.push(promptTag)
          setTag(newTags)
        }
      });
    });
  }, [searchTerm, tags]);

  const onSearchChange = event => {
    const newSearchTerm = event.target.value
    const results = getSearchResults(newSearchTerm)

    setSearchTerm(event.target.value);
    setSearchResults(results);
  };

  const populateInput = event => {
    const newSearchTerm = event.target.attributes.getNamedItem('data-search-term').value;
    const results = getSearchResults(newSearchTerm)

    setSearchTerm(newSearchTerm);
    setSearchResults(results);
  }
  return (
    <>
      <h2>Discuss a topic</h2>
      <div className="govuk-form-group govuk-!-margin-bottom-7">
        <div className="govuk-!-padding-bottom-4" id='example-search'>
          <label htmlFor="text-input">Try searching for keywords like{' '}</label>
          <button className='button-as-link govuk-!-padding-0' data-search-term='coronavirus' onClick={populateInput} data-testid='coronavirus'>coronavirus</button>,{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='food' onClick={populateInput} data-testid='food'>food</button>,{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='health' onClick={populateInput}>health</button>, or{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='benefits'onClick={populateInput}>benefits</button>
        </div>
        <input
          id="text-input"
          list='input-tags'
          type="text"
          className="govuk-input govuk-input--width-20"
          value={searchTerm}
          onChange={onSearchChange}
          autoComplete="off"
        />
        <datalist id="input-tags">
          {searchTerm &&
            tags.sort().map((t,i) => (
              <option key={i}>{t}</option>
            ))
          }
        </datalist>
      </div>

      { searchResults.length > 0 &&
        <>
          <ul className="govuk-list conv-prompt">
            { searchResults.map((result, i) =>
              <li key={i}>
                <p className="govuk-!-margin-bottom-0 conv-prompt-text">
                  { result.prompt }
                </p>
                <Markdown options={{
                  overrides: { span: { props: {
                    className: 'govuk-!-font-size-16 conv-support-text'
                  }}}
                }}>
                  { result.supportingInformation ?? "" }
                </Markdown>
              </li>)
            }
          </ul>
        </>
      }

      { searchTerm.length > 0 &&
        searchResults.length == 0 &&
        <>
          <p>No results for "{searchTerm}"</p>
        </>
      }
    </>
  )
}

export default TopicExplorer;
