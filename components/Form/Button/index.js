const Button = ({ onClick, text, isSecondary, ...others }) => (
  <div className="govuk-form-group">
    <button
      className={`govuk-button${isSecondary === true ? ' govuk-button--secondary' : ''}`}
      data-module="govuk-button"
      onClick={onClick}
      {...others}>
      {text}
    </button>
  </div>
);

export default Button;
