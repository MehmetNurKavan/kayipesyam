import { Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './components/home/HomePage';
import MatchingPage from './features/matching/MatchingPage';
import LostItemsPage from './features/lostItems/LostItemsPage';
import FoundItemsPage from './features/foundItems/FoundItemsPage';
import MessagingPage from './features/messaging/MessagingPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import './App.css';
import AuthPage from './features/auth/AuthPage';
import ProfilePage from './features/profile/ProfilePage';
import SearchPage from './features/searchItems/SearchPage';
import RequestFormPage from './features/request/RequestFormPage';
import FoundRequestPage from './features/foundRequestView/FoundRequestPage';
import LostRequestPage from './features/lostRequestview/LostRequestPage';

const App: React.FC = () => {

  return (
    <div className="appContainer">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-items" element={<SearchPage />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/lost-items" element={<LostItemsPage />} />
          <Route path="/lost-items/:id" element={<LostRequestPage />} />
          <Route path="/found-items" element={<FoundItemsPage />} />
          <Route path="/found-items/:id" element={<FoundRequestPage />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/request/:id" element={<RequestFormPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
