// import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faComments,
  faCircle,
  faSquare,
  faHeadSideVirus,
  faHeartbeat,
  faWalking,
  faPalette,
  faAppleAlt,
  faHandHoldingHeart,
  faPoundSign,
  faSuitcase,
  faHome,
  faInfo
} from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.scss';
const CategoryCard = ({ category, onclick }) => {
  const categoryIcons = {
    'First category': faPhone,
    'Second category': faComments,
    'Loneliness or isolation': faComments,
    'Anxiety or mental health': faHeadSideVirus,
    'Safe and healthy body': faHeartbeat,
    'Exercise and wellbeing': faWalking,
    'Arts and creativity': faPalette,
    'Food or shopping': faAppleAlt,
    'Faith-led activities': faHandHoldingHeart,
    'Money advice': faPoundSign,
    'Employment advice': faSuitcase,
    'Housing advice': faHome,
    'Immigration advice': faInfo,
    'Disabilities or autism': '',
    default: faSquare
  };
  return (
    <div className={`${styles['card']}`} onClick={() => onclick(category.name)}>
      <div className={`${styles['icon']} fa-layers fa-fw`}>
        <FontAwesomeIcon icon={faCircle} color="green" />
        <FontAwesomeIcon
          icon={categoryIcons[category.name] ? categoryIcons[category.name] : categoryIcons.default}
          inverse
          transform="shrink-6"
        />
      </div>
      <div className={styles['content']}>
        <h4 className={`${styles['card-title']}`}>{category.name}</h4>
        <p>{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
