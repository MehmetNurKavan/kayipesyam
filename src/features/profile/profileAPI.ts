import { getAuth } from 'firebase/auth';

export const fetchUserEmail = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            resolve(user.email);
        } else {
            resolve(null);
        }
    });
};
