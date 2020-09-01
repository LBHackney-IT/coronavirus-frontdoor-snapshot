const TopicExplorer = (props) => {
  return (
    <>
      <h1>Topics to explore</h1>
      <div className="govuk-form-group">
        <h2>How can we help?</h2>
        <input type="text" className="govuk-input govuk-input--width-20" placeholder="e.g. food, mental health, lockdown" />
      </div>
      <h2>Conversational prompts</h2>
      <ul className="govuk-list">
        <li><p>How are you doing/managing at the moment?</p></li>
        <li><p>Do you have anyone around to help support you?</p></li>
        <li><p>What are your main concerns at the moment?</p></li>
      </ul>
    </>
  )
}

export default TopicExplorer;
