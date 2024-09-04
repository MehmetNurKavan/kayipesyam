import { db } from '../../utils/firebase';
import { collection, addDoc, getDocs, getDoc, query, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';

// Bir sohbeti başlatmak veya mevcut sohbeti almak için
export const fetchChat = async (user1Email: string, user2Email: string) => {
    console.log("Fetching chat between:", user1Email, "and", user2Email);
    const chatQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user1Email));
    const chatSnapshot = await getDocs(chatQuery);

    let chat = chatSnapshot.docs.find(doc => doc.data().participants.includes(user2Email));

    if (!chat) {
        console.log("No existing chat found. Creating new chat.");
        const newChat = await addDoc(collection(db, 'chats'), {
            participants: [user1Email, user2Email],
            messages: [],
        });
        return newChat.id;
    } else {
        console.log("Existing chat found:", chat.id);
        return chat.id;
    }
};

// Mesajları almak için
export const fetchMessages = async (chatId: string) => {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    return chatDoc.exists() ? chatDoc.data().messages : [];
};

// Mesaj göndermek için
export const sendMessage = async (chatId: string, message: { sender: string; text: string; timestamp: string }) => {
    try {
        await updateDoc(doc(db, 'chats', chatId), {
            messages: arrayUnion(message),
        });
        console.log("Message sent to Firebase:", message);
    } catch (error) {
        console.error("Error sending message to Firebase:", error);
    }
};

/*
fetchChat: Kullanıcılar arasındaki sohbeti başlatır veya mevcut sohbeti getirir.
fetchMessages: Belirli bir sohbete ait mesajları getirir.
sendMessage: Mesaj gönderir.
markAsDelivered: Eşyayı teslim edilmiş olarak işaretler.
endChat: Sohbeti sonlandırır.
*/
