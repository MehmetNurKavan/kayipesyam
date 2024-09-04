import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addNotification, removeNotification } from './notificationsSlice';
import styles from './notifications.module.css';

const NotificationsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notifications.notifications);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/auth'); // Giriş yapılmadıysa auth sayfasına yönlendir
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    const handleAddNotification = () => {
        dispatch(addNotification({
            id: '1',
            message: 'New notification!',
            timestamp: new Date().toISOString(),
        }));
    };

    const handleRemoveNotification = (id: string) => {
        dispatch(removeNotification(id));
    };

    if (loading) {
        return <div>Loading...</div>; // Yüklenme durumunda gösterilecek şeyler
    }

    if (!isAuthenticated) {
        return null; // Kullanıcı giriş yapmamışsa hiçbir şey göstermiyoruz, yönlendirme yapılacak
    }

    return (
        <div className={styles.container}>
            <h1>Notifications</h1>
            <button onClick={handleAddNotification}>Add Notification</button>
            <ul>
                {notifications.map(notif => (
                    <li key={notif.id}>
                        <p>Message: {notif.message}</p>
                        <p>Timestamp: {notif.timestamp}</p>
                        <button onClick={() => handleRemoveNotification(notif.id)}>Remove Notification</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;