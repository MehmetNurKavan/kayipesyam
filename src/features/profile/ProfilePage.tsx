import type React from 'react';
import { useEffect } from 'react'; //use stateyi sildim
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setEmail, clearProfile } from './profileSlice';
import styles from './profile.module.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => state.profile.email);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setEmail(user.email || null));
            } else {
                dispatch(clearProfile());
                navigate('/auth'); // Kullanıcı giriş yapmamışsa auth sayfasına yönlendir
            }
        });

        return () => unsubscribe();
    }, [auth, dispatch, navigate]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch(clearProfile());
                navigate('/auth'); // Çıkış yapıldıktan sonra auth sayfasına yönlendir
            })
            .catch((error) => {
                console.error('Çıkış yapılırken bir hata oluştu:', error);
            });
    };

    return (
        <div className={styles.container}>
            {email ? (
                <>
                    <h2>Hoş geldiniz, {email}!</h2>
                    <button onClick={handleLogout} className={styles.logoutButton}>Çıkış Yap</button>
                </>
            ) : (
                <h2>Giriş yapmanız gerekiyor.</h2>
            )}
        </div>
    );
};

export default ProfilePage;
