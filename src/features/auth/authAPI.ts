import { auth } from '../../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Kullanıcı giriş işlemi
export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Bir hata oluştu.');
        }
    }
};

// Kullanıcı kayıt işlemi
export const register = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Bir hata oluştu.');
        }
    }
};
//kullancıı çıkış işlemi
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Çıkış yaparken hata oluştu:', error);
        throw error;
    }
};