import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
    'Loneliness or isolation': { icon: faComments, color: '#df1995' },
    'Anxiety or mental health': { icon: faHeadSideVirus, color: '#ff6a13' },
    'Safe and healthy body': { icon: faHeartbeat, color: '#84bd00' },
    'Exercise and wellbeing': { icon: faWalking, color: '#e03c31' },
    'Arts and creativity': { icon: faPalette, color: '#025ea6' },
    'Food or shopping': { icon: faAppleAlt, color: '#328472' },
    'Faith-led activities': { icon: faHandHoldingHeart, color: '#0085ca' },
    'Money advice': { icon: faPoundSign, color: '#81312f' },
    'Employment advice': { icon: faSuitcase, color: '#8031a7' },
    'Housing advice': { icon: faHome, color: '#2b8cc4' },
    'Immigration advice': { icon: faInfo, color: '#00664f' },
    'Disabilities or autism': { icon: '', color: '#' },
    default: { icon: faSquare, color: '#df1995' }
  };

  return (
    <div className={`${styles['card']}`} onClick={() => onclick(category.name)}>
      <div className={`${styles['icon']} fa-layers fa-fw`}>
        <FontAwesomeIcon
          icon={faCircle}
          color={categoryIcons[category.name]?.color || categoryIcons.default.color}
        />
        <FontAwesomeIcon
          icon={categoryIcons[category.name]?.icon || categoryIcons.default.icon}
          inverse
          transform="shrink-6"
        />
      </div>
      <div className={styles['content']}>
        <h4>{category.name}</h4>
        <p>{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
