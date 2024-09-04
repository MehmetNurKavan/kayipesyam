import type { FC } from 'react';
import styles from './header.module.css';
import kayipesyamLogo from '../../assets/images/kayipesyam_logo_text.png';
import Navbar from '../navbar/Navbar';

const Header: FC = () => {
    return (
        <header className={styles.header}>
            <img src={kayipesyamLogo} alt="Kayıp Eşyam" className={styles.logo} />
            <Navbar />
        </header>
    );
};

export default Header;
