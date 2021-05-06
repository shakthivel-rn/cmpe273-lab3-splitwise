/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import YouOwe from './YouOwe';

describe('You Owe Component', () => {
  test('renders YouOwe component', async () => {
    render(<YouOwe />);
    expect(screen.getByText(/You Owe/)).toBeInTheDocument();
    expect(screen.queryByText('You Owe:')).toBeNull();

    expect(screen.getByText('You do not owe anything')).toBeInTheDocument();
  });
});
