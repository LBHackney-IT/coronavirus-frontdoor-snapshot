import css from './index.module.scss';
const OverviewBox = ({ number, label, id }) => {
  return (
    <div id={id} className="govuk-grid-column-one-third">
      <div className={css.box}>
        <span className={css.number}>{number}</span>
        <br />
        <span className={css.label}>{label}</span>
      </div>
    </div>
  );
};

export default OverviewBox;
