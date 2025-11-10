import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/atoms/ButtonT';
import Link from '@/components/atoms/Link';

describe('Button', () => {
  test('renderiza con el texto correcto', () => {
    render(<Link href="/home" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  });