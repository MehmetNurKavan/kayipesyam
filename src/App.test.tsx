import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Helper function to render the App with Router
const renderWithRouter = () => {
  render(
    <Router>
      <App />
    </Router>
  );
};

test('renders header component', () => {
  renderWithRouter();
  const headerElement = screen.getByText(/header/i); // Header içeriğini uygun şekilde yazın
  expect(headerElement).toBeInTheDocument();
});

test('renders navbar component', () => {
  renderWithRouter();
  const navbarElement = screen.getByText(/navbar/i); // Navbar içeriğini uygun şekilde yazın
  expect(navbarElement).toBeInTheDocument();
});

test('renders sidebar component', () => {
  renderWithRouter();
  const sidebarElement = screen.getByText(/sidebar/i); // Sidebar içeriğini uygun şekilde yazın
  expect(sidebarElement).toBeInTheDocument();
});

test('renders footer component', () => {
  renderWithRouter();
  const footerElement = screen.getByText(/footer/i); // Footer içeriğini uygun şekilde yazın
  expect(footerElement).toBeInTheDocument();
});

test('renders home page', () => {
  renderWithRouter();
  const homePageElement = screen.getByText(/home page content/i); // Ana sayfa içeriğini uygun şekilde yazın
  expect(homePageElement).toBeInTheDocument();
});
