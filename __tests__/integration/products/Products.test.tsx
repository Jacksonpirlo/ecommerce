import { render, screen, waitFor } from '@testing-library/react';
import Products from '@/modules/dashboard/template/Products';
import { getProducts } from '@/services/products';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

jest.mock('next-auth/react', () => ({
    useSession: () => ({
    data: { user: { id: 'user123' } }
  })
}))

jest.mock('@/services/products', () => ({
  getProducts: jest.fn(() => Promise.resolve({
    products: [],
    pages: 1
  }))
}));

const mockProducts = [
  {
    _id: '1',
    name: 'Cactus',
    price: 100,
    description: 'Un hermoso cactus',
    image: '/cactus.jpg',
    type: 'Planta'
  }
];

describe("Products Component",() => {

    beforeEach(() => {
        (getProducts as jest.Mock).mockResolvedValue({
            products: mockProducts,
            page: 1
        })
    })

    test("se renderiza correctamente", async () => {
    render(<Products />);
    expect(screen.getByPlaceholderText('buscar')).toBeInTheDocument();
    await waitFor(() => {
        expect(screen.getByText('Cactus')).toBeInTheDocument();
        expect(screen.getByText('$100')).toBeInTheDocument();
    })
    });
})