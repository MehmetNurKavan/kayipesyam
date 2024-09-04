import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { initializeChat, loadMessages, postMessage } from './messagingSlice';
import styles from './messaging.module.css';

const MessagingPage: React.FC = () => {
    const location = useLocation();
    const { user1Email, user2Email } = location.state as { user1Email: string; user2Email: string };
    const dispatch = useAppDispatch();
    const chatId = useAppSelector(state => state.messaging.chatId);
    const messages = useAppSelector(state => state.messaging.messages);
    const [newMessage, setNewMessage] = useState('');
    const auth = getAuth();

    useEffect(() => {
        console.log("useEffect for initializeChat triggered");
        if (user1Email && user2Email) {
            dispatch(initializeChat({ user1Email, user2Email }))
                .unwrap()
                .then((id: string) => {
                    console.log("Chat initialized with ID:", id);
                })
                .catch((error) => {
                    console.error("Error initializing chat:", error);
                });
        }
    }, [dispatch, user1Email, user2Email]);

    useEffect(() => {
        console.log("useEffect for loadMessages triggered with chatId:", chatId);
        if (chatId) {
            dispatch(loadMessages(chatId))
                .unwrap()
                .then((messages) => {
                    console.log("Messages loaded:", messages);
                })
                .catch((error) => {
                    console.error("Error loading messages:", error);
                });
        }
    }, [dispatch, chatId]);


    const handleSendMessage = () => {
        const currentUser = auth.currentUser;
        if (newMessage.trim() !== '' && chatId) {
            if (currentUser && currentUser.email) {
                const message = {
                    sender: currentUser.email,
                    text: newMessage,
                    timestamp: new Date().toISOString(),
                };
                dispatch(postMessage({ chatId, message }))
                    .unwrap()
                    .then(() => {
                        console.log("Message sent successfully:", message);
                        setNewMessage('');
                    })
                    .catch((error) => {
                        console.error("Error sending message:", error);
                    });
            } else {
                console.error("No current user or user email found");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1>Mesajlaşma Sayfası</h1>
            <div className={styles.messages}>
                {messages.map((msg: any, index: number) => (
                    <div key={index} className={styles.message}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Bir şeyler yaz..."
                />
                <button onClick={handleSendMessage}>Gönder</button>
            </div>
        </div>
    );
};

export default MessagingPage;
/*
State Yönetimi: Mesajlar ve mesaj gönderme işlemleri için state'ler kullanılır.
Mesaj Yükleme: useEffect içinde loadMessages fonksiyonu çağrılarak mesajlar Firebase'den alınır.
Mesaj Gönderme: Kullanıcı mesaj gönderdiğinde postMessage fonksiyonu çağrılır.
UI: Kullanıcıya mesajları gösterir ve yeni mesajlar gönderebilmesi için bir arayüz sunar.
*/