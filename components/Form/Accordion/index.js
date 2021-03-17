import styles from './index.module.scss';

const Accordion = ({ children, title, handleExpanded }) => (
  <div className="govuk-accordion" data-module="govuk-accordion">
    <div className={`${styles['lbh-accordion__header']}`}>
      <div>{title && <h2>{title}</h2>}</div>
      <div
        className={`govuk-accordion__controls ${styles['lbh-accordion__controls']}`}
        onClick={handleExpanded}></div>
    </div>

    {children}
  </div>
);

export default Accordion;
