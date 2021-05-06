/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import YouAreOwed from './YouAreOwed';

describe('You Owe Component', () => {
  test('renders YouOwe component', () => {
    render(<YouAreOwed />);
    expect(screen.getByText(/You Are Owed/)).toBeInTheDocument();
    expect(screen.queryByText('You Are Owed:')).toBeNull();

    expect(screen.getByText('You are not owed anything')).toBeInTheDocument();
  });
});
