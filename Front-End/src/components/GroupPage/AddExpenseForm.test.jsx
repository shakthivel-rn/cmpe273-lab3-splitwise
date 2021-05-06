/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AddExpenseForm from './AddExpenseForm';

describe('You Owe Component', () => {
  test('renders YouOwe component', () => {
    render(<AddExpenseForm />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Save:')).toBeNull();
  });
});
