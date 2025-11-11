# Pruebas de Integración en Next.js (App Router) con Jest + React Testing Library (RTL)

---

## 0) ¿Qué es RTL?

**React Testing Library (RTL)** es una librería enfocada en probar interfaces **como lo haría un usuario real**, no el desarrollador.  
Sus principios clave:
- Seleccionar elementos por **rol**, **nombre**, **texto**, **label** (accesibilidad).
- Simular interacciones reales: clics, tipeo, teclado con `@testing-library/user-event`.
- Evitar probar implementaciones internas y centrarse en **comportamiento observable**.

---

## 1) Diferencias: Unitarias vs Integración vs E2E

| Tipo de prueba | Enfoque | ¿Qué cubre? | Dobles de prueba | Velocidad | Cuándo usar |
|---|---|---|---|---|---|
| **Unitarias** | 1 sola pieza aislada | Lógica interna | Mocks para TODAS las dependencias | Muy rápida | Para helpers, funciones, hooks |
| **Integración** | Múltiples piezas juntas | Flujo entre componentes o funciones | Mocks solo en fronteras (fetch, router) | Rápida/Media | Validar interacciones entre componentes |
| **E2E** | Toda la app | UI real + backend | Sin mocks | Lenta | Validar flujos reales de usuario |

---

## 2) Requisitos

Ya debes tener configurado Jest + RTL + jsdom, con los scripts:

```jsonc
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

---

## 3) Estructura de la clase

```
src/
  components/
    ui/Button.tsx
    Display.tsx
    GoDetail.tsx
    LoginForm.tsx
  features/demo/SimplePage.tsx
  lib/fetcher.ts
__tests__/integration/
  SimplePage.int.test.tsx
  LoginForm.int.test.tsx
  Router.int.test.tsx
```

---

# 4) EJEMPLO A — INTEGRACIÓN SIMPLE DE COMPONENTES (por props)

## 4.1 Componentes usados

### `Button.tsx`
```tsx
'use client';
type Props = { label: string; onClick?: () => void; disabled?: boolean };

export default function Button({ label, onClick, disabled }: Props) {
  return <button disabled={disabled} onClick={onClick}>{label}</button>;
}
```

### `Display.tsx`
```tsx
'use client';
export default function Display({ value }: { value: number }) {
  return <p>Valor: <span aria-label="count">{value}</span></p>;
}
```

### `SimplePage.tsx`
```tsx
'use client';
import { useState } from 'react';
import Button from '@/src/components/ui/Button';
import Display from '@/src/components/Display';

export default function SimplePage() {
  const [value, set] = useState(0);

  return (
    <div>
      <h1>Demo</h1>
      <Display value={value} />
      <Button label="+" onClick={() => set((v) => v + 1)} />
      <Button label="-" onClick={() => set((v) => v - 1)} />
    </div>
  );
}
```

---

## 4.2 Test de integración simple

`SimplePage.int.test.tsx`

```tsx
// Importamos funciones principales para renderizar y buscar elementos en el DOM virtual
import { render, screen } from '@testing-library/react';

// userEvent simula acciones del usuario: clic, escritura, teclado, etc.
import userEvent from '@testing-library/user-event';

// Importamos la página que integra varios componentes
import SimplePage from '@/src/features/demo/SimplePage';

describe('SimplePage (integración simple por props)', () => {
  it('actualiza el valor al hacer clic en + y -', async () => {
    // Preparamos simulador de usuario
    const user = userEvent.setup();

    // Renderizamos la página completa
    render(<SimplePage />);

    // Obtenemos el span que muestra el valor actual (aria-label="count")
    const value = screen.getByLabelText('count');

    // Verificamos estado inicial
    expect(value).toHaveTextContent('0');

    // Simulamos clic en el botón "+"
    await user.click(screen.getByRole('button', { name: '+' }));

    // Validamos incremento
    expect(value).toHaveTextContent('1');

    // Simulamos clic en el botón "-"
    await user.click(screen.getByRole('button', { name: '-' }));

    // Validamos que vuelva a 0
    expect(value).toHaveTextContent('0');
  });
});
```

---

# 5) EJEMPLO B — FORMULARIO + MOCK DE API (fetch)

## 5.1 `fetcher.ts`
```ts
export async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}
```

## 5.2 `LoginForm.tsx`
```tsx
'use client';
import { useState } from 'react';
import { postJSON } from '@/src/lib/fetcher';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Cargando...');

    try {
      const data = await postJSON('/api/login', { email });
      setMsg(`Bienvenido ${data.name}`);
    } catch {
      setMsg('Error de red');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Entrar</button>
      <p aria-live="polite">{msg}</p>
    </form>
  );
}
```

---

## 5.3 Test de integración (CON COMENTARIOS DETALLADOS)

`LoginForm.int.test.tsx`

```tsx
// Funciones principales de RTL
import { render, screen } from '@testing-library/react';

// userEvent para simular acciones reales del usuario
import userEvent from '@testing-library/user-event';

// Componente que vamos a probar
import LoginForm from '@/src/components/LoginForm';

// Antes de cada test, reemplazamos fetch por un mock
beforeEach(() => { global.fetch = jest.fn(); });

// Después de cada test, limpiamos los mocks
afterEach(() => { jest.resetAllMocks(); });

describe('LoginForm (integración + mock de red)', () => {

  it('muestra éxito cuando API responde 200', async () => {
    // Simulamos que la API responde bien con un usuario "Ada"
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Ada' }),
    });

    const user = userEvent.setup();

    // Renderizamos el formulario
    render(<LoginForm />);

    // Escribimos un email en el input
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

    // Hacemos clic en el botón de enviar
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // findByText espera hasta que el mensaje aparezca (asíncrono)
    expect(await screen.findByText(/bienvenido ada/i)).toBeInTheDocument();
  });


  it('muestra error cuando la API falla', async () => {
    // Mock: la API responde mal (ok=false)
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const user = userEvent.setup();
    render(<LoginForm />);

    // Escribimos el email
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

    // Clic en enviar
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Esperamos mensaje de error
    expect(await screen.findByText(/error de red/i)).toBeInTheDocument();
  });

});
```

---

# 6) EJEMPLO C — NAVEGACIÓN (mock de next/navigation)

## 6.1 Componente

```tsx
'use client';
import { useRouter } from 'next/navigation';

export default function GoDetail({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(`/detail/${id}`)}>
      Ver detalle
    </button>
  );
}
```

---

## 6.2 Test con comentarios detallados

`Router.int.test.tsx`

```tsx
// Importamos herramientas de RTL
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Creamos un mock manual del router
const push = jest.fn();

// Sobrescribimos useRouter para este test
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Importamos el componente
import GoDetail from '@/src/components/GoDetail';

describe('GoDetail (integración + router)', () => {
  it('llama a router.push con la ruta correcta', async () => {
    const user = userEvent.setup();

    // Renderizamos el componente con id=42
    render(<GoDetail id="42" />);

    // usuario hace clic en "Ver detalle"
    await user.click(screen.getByRole('button', { name: /ver detalle/i }));

    // verificamos que router.push fue llamado correctamente
    expect(push).toHaveBeenCalledWith('/detail/42');
  });
});
```

---

# 7) Buenas prácticas

- Usa **selectores accesibles** (`getByRole`, `getByLabelText`, `findByText`).
- Mockea **solo las fronteras**.
- Usa `findBy*` para contenido asíncrono.
- NO pruebes estados internos. Prueba **comportamiento visible**.

---

# 8) Retos fáciles

1. Formulario que valida email (deshabilita botón).
2. Página con contador y botón "Reiniciar".

---

# 9) Comandos

```
npm run test
npm run test:watch
npm run test:cov
```

---