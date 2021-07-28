import css from './index.module.scss';

const Details = ({ color, children, title, onclick, id }) => (
  <details
    className={`govuk-details ${css['lbh-details']}`}
    data-module="govuk-details"
    id={`details-${id}`}>
    <summary
      className={`govuk-details__summary ${css['lbh-details__summary']}`}
      style={color && { color: `${color}` }}
      id={`summary-${id}`}
      onClick={onclick}>
      <span id={`span-${id}`}>{title}</span>
    </summary>
    <div className={`govuk-details__text ${css['lbh-details__text']}`}>{children}</div>
  </details>
);

export default Details;
