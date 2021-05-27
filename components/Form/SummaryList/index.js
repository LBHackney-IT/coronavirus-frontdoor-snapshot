const SummaryList = ({ name, entries, customStyle }) => (
  <div>
    <dl className={customStyle} id={name}>
      {Object.entries(entries).map(([key, value], index) => {
        return (
          value && (
            <div className="govuk-summary-list__row" key={`list-${key}-${index}`}>
              <dt className="govuk-summary-list__key">{key}</dt>
              <dd className="govuk-summary-list__value">{`${value}`}</dd>
            </div>
          )
        );
      })}
    </dl>
  </div>
);

export default SummaryList;
