// __tests__/Search.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '@/components/atoms/Search';

test('refleja el texto ingresado', async () => {
  const user = userEvent.setup();
  render(<Search />);

  const input = screen.getByPlaceholderText(/escribe/i);
  await user.type(input, 'next app router');

  expect(screen.getByTestId('mirror')).toHaveTextContent('next app router');
});