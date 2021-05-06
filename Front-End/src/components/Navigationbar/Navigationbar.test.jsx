/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigationbar from './Navigationbar';

describe('You Owe Component', () => {
  test('renders YouOwe component', () => {
    render(<Navigationbar />);
    expect(screen.getByText('Splitwise')).toBeInTheDocument();
    expect(screen.queryByText('Splitwise:')).toBeNull();
  });
});
