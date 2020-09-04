import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';

const TopicExplorer = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const getSearchResults = (searchTerm) => {
    var results = []
    const newSearchTerm = searchTerm.toLowerCase();

    for(const topic of props.topics) {
      if(topic.tags.includes(newSearchTerm)) {
        results.push(topic);
      }
    }
    return results
  }

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
      <h1>Topics to explore</h1>
      <div className="govuk-form-group">
        <h2>How can we help?</h2>
        <input
          type="text"
          className="govuk-input govuk-input--width-20"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <div id='example-search'>Try a search for{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='food' onClick={populateInput} data-testid='food'>food</button>,{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='mental health' onClick={populateInput}>mental health</button>, or{' '}
          <button className='button-as-link govuk-!-padding-0' data-search-term='debt'onClick={populateInput}>debt</button>
        </div>
      </div>

      { searchResults.length > 0 &&
        <>
          <h2>Conversational prompts</h2>
          <ul className="govuk-list govuk-list--bullet">
            { searchResults.map((result, i) =>
              <li key={i}>
                <p className="govuk-!-margin-bottom-1">
                  { result.prompt }
                </p>
                <Markdown options={{
                  overrides: { span: { props: {
                    className: 'govuk-!-font-size-16',
                    style: { color: '#505a5f' }
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
