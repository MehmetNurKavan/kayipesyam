import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaHandsHelping, FaQuestion, FaRegBell, FaUser, FaCheckCircle } from 'react-icons/fa'; // İkonları buradan import ediyoruz
import styles from './navbar.module.css';

const Navbar: FC = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" title="Ana Sayfa" className={styles.navItem}><FaHome /></Link>
            <Link to="/search-items" title="Eşya Ara" className={styles.navItem}><FaSearch /></Link>
            <Link to="/matching" title="Eşleşme" className={styles.navItem}><FaHandsHelping /></Link>
            <Link to="/lost-items" title="Kayıp Eşya" className={styles.navItem}><FaQuestion /></Link>
            <Link to="/found-items" title="Bulunan Eşya" className={styles.navItem}><FaCheckCircle /></Link>
            <Link to="/notifications" title="Bildirim" className={styles.navItem}><FaRegBell /></Link>
            <Link to="/profile" title="Hesabım" className={styles.navItem}><FaUser /></Link>
        </nav>
    );
};

export default Navbar;
