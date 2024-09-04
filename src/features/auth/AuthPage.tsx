import type React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, registerUser, logoutUser } from './authSlice';
import styles from './auth.module.css';

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(registerUser({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className={styles.container}>
      {user ? (
        <>
          <h2>Hoş geldiniz, {user.email}!</h2>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </>
      ) : (
        <>
          <h2>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
          </button>
        </>
      )}
      {status === 'loading' && <p>Yükleniyor...</p>}
      {status === 'failed' && <p>{error || 'Bir hata oluştu.'}</p>}
    </div>
  );
};

export default AuthPage;
