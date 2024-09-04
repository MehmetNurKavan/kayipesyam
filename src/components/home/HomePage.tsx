import type React from 'react';
import { useState, useEffect } from 'react';
import styles from './homePage.module.css';

// Fotoğrafları içe aktarın
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';

const images = [image1, image2, image3];

const HomePage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5 saniyede bir değişir

        return () => clearInterval(interval); // Temizlik
    }, []);

    return (
        <div className={styles.homePage}>
            <div className={styles.carousel}>
                <img src={images[currentIndex]} alt="Kayıp Esyam" className={styles.image} />
                <div className={styles.overlay}>
                    <h2 className={styles.text}>Kayıp Eşyam, kayıp ve bulunan mülk ile insanları yeniden bir araya getiriyor</h2>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
