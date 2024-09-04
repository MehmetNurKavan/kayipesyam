import type { FC } from 'react';
import styles from './footer.module.css';
import kayipesyamLogo from '../../assets/images/logo.png';

const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <img src={kayipesyamLogo} alt="Kayıp Eşyam" className={styles.logo} />
                <p> Tüm Hakları Saklıdır. 2024 &copy;</p>
            </div>
        </footer>
    );
};

export default Footer;
