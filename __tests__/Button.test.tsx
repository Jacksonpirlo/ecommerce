import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/atoms/ButtonT';

describe('Button', () => {
  test('renderiza con el texto correcto', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('dispara onClick al hacer clic', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button label="Click me" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('respeta el estado disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button label="Nope" onClick={handleClick} disabled />);
    const btn = screen.getByRole('button', { name: /nope/i });

    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('accesibilidad: usa role y label correctos', () => {
    render(<Button label="Enviar" aria-label="Enviar formulario" />);
    expect(screen.getByRole('button', { name: /enviar formulario/i })).toBeInTheDocument();
  });

  test('interacción de teclado (Enter/Espacio)', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button label="Keyable" onClick={handleClick} />);
    const btn = screen.getByRole('button', { name: /keyable/i });

    btn.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});