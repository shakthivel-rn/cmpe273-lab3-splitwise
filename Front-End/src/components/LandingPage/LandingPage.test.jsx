/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';

describe('You Owe Component', () => {
  test('renders YouOwe component', () => {
    render(<LandingPage />);
    expect(screen.getByText('Less stress when')).toBeInTheDocument();
    expect(screen.getByText('sharing expenses')).toBeInTheDocument();
    expect(screen.getByText('on trips')).toBeInTheDocument();
    expect(screen.queryByText('Less stress when:')).toBeNull();
  });
});
