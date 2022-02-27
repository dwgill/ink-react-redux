import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App><p>App content!</p></App>);
  const appContentEl = screen.getByText("App content!");
  expect(appContentEl).toBeInTheDocument();
});
