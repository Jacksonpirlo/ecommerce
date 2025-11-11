# Testing en Next.js (App Router) con TypeScript, Jest y React Testing Library


---

## 1) Prerrequisitos

- Node 18+
- Proyecto Next.js con **App Router** (`/app`). Si partes de cero:
  ```bash
  npx create-next-app@latest my-app --ts --eslint
  cd my-app
  ```

---

## 2) Instala dependencias de testing

```bash
npm i -D jest jest-environment-jsdom @types/jest   @testing-library/react @testing-library/jest-dom @testing-library/user-event   ts-jest next@latest
```

> **Por qué:**  
> - `jest` = runner.  
> - `jest-environment-jsdom` = DOM virtual.  
> - `@testing-library/*` = utilidades de pruebas para React + matchers.  
> - `ts-jest` = compilar TS en Jest.  
> - `next` (peer) para que el preset de Next funcione si lo usas.

---

## 3) Configura Jest (App Router)

Crea **`jest.config.ts`** en la raíz:

```ts
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  // Ubicaciones de tests
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  // Soporte TS
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  moduleNameMapper: {
    // Ignora estilos y assets en imports
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1', // Si usas alias @ -> "./"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  clearMocks: true,
};

export default config;
```

Crea **`jest.setup.ts`**:

```ts
// jest.setup.ts
import '@testing-library/jest-dom';
```

En **`package.json`**, agrega scripts:

```jsonc
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

> **Nota App Router:** normalmente probamos **Client Components** (con `"use client"`) y lógica pura. Para Server Components, extrae la lógica a utilidades y pruébalas como funciones puras.

---

## 4) Estructura sugerida

```
src/
  components/
    ui/
      Button.tsx
  lib/
    sum.ts
__tests__/
  Button.test.tsx
  sum.test.ts
```

> Si usas alias `@`, ajusta `tsconfig.json`:
```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## 5) Componente de ejemplo (Button)

Crea `src/components/ui/Button.tsx`:

```tsx
'use client';

import React from 'react';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = 'button',
  ...aria
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-md border focus:outline-none focus:ring"
      {...aria}
    >
      {label}
    </button>
  );
};

export default Button;
```

> **Visualízalo:** en cualquier Client Page/Component del App Router:
```tsx
'use client';

import Button from '@/src/components/ui/Button';

export default function Demo() {
  const handleClick = () => alert('Clicked!');
  return <Button label="Click me" onClick={handleClick} />;
}
```

---

## 6) Pruebas unitarias del Button (RTL)

Crea `__tests__/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/src/components/ui/Button';

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
```

Ejecuta:
```bash
npm run test
```

---

## 7) Otros casos comunes de pruebas unitarias

### 7.1 Funciones puras (lib)

`src/lib/sum.ts`:
```ts
export const sum = (a: number, b: number) => a + b;
```

`__tests__/sum.test.ts`:
```ts
import { sum } from '@/src/lib/sum';

describe('sum', () => {
  it('suma números', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('maneja negativos', () => {
    expect(sum(-2, 3)).toBe(1);
  });
});
```

### 7.2 Input + estado controlado

```tsx
// src/components/Search.tsx
'use client';
import React from 'react';

export default function Search() {
  const [q, setQ] = React.useState('');
  return (
    <div>
      <label htmlFor="q">Buscar</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escribe..." />
      <p data-testid="mirror">{q}</p>
    </div>
  );
}
```

```tsx
// __tests__/Search.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '@/src/components/Search';

test('refleja el texto ingresado', async () => {
  const user = userEvent.setup();
  render(<Search />);

  const input = screen.getByPlaceholderText(/escribe/i);
  await user.type(input, 'next app router');

  expect(screen.getByTestId('mirror')).toHaveTextContent('next app router');
});
```




---

## 8) Consejos rápidos (App Router)

- Prefiere **probar comportamiento** (texto, roles, accesibilidad) sobre detalles de implementación.   
- Usa `screen.getByRole` + `name` para acceder a elementos de forma accesible.  
- Mantén los tests **rápidos y determinísticos** (sin llamadas reales de red).

---

## 9) Retos

1. Crear un componente **Counter** con botones `+` y `-`, y probar:
   - Render inicial en `0`
   - Click en `+` incrementa
   - Click en `-` decrementa
   - Teclado: `{ArrowUp}` incrementa, `{ArrowDown}` decrementa
2. Crear un **Form** con un input de email y botón submit:
   - Valida formato
   - Deshabilita el botón si el email es inválido
   - Prueba que el mensaje de error aparece y desaparece

---

## 10) Troubleshooting común

- **`Cannot find module '@/...'`** → Revisa `paths` en `tsconfig.json` y `moduleNameMapper` en `jest.config.ts`.  
- **`TextEncoder is not defined`** → Asegúrate `testEnvironment: 'jest-environment-jsdom'`.  
- **Imports de `.css` fallan** → Agrega `identity-obj-proxy` en `moduleNameMapper`.  
- **`Hooks can only be called inside of the body of a function component`** → Usa `render`/`renderHook` correctamente.  

---

## 11) Comandos finales

```bash
npm run test        # correr una vez
npm run test:watch  # modo watch
npm run test:cov    # cobertura
```