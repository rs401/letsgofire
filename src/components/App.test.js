import { render, screen } from '@testing-library/react';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';

test('renders lets go header text', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const footerTextElement = screen.getByText(/© 2022 Lets Go/i);
  expect(footerTextElement).toBeInTheDocument();
});
