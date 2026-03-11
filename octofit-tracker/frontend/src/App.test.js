import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the main navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.getByText(/octofit tracker/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^activities$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^teams$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^workouts$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^leaderboard$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^users$/i })).toBeInTheDocument();
});
