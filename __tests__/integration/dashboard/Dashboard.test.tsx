import DashboardPage from "@/modules/dashboard/template/Dashboard";
import { render, screen } from "@testing-library/react";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string)=> key
    })
}))

describe('Dashboard works', () => {
    test('i18n works', () => {
        render(<DashboardPage />)
        expect(screen.getByText('bienvenido')).toBeInTheDocument();
    })

    test('Verify if the video is playing', () => {
        render(<DashboardPage />);
        const video = document.querySelector('video');
        expect(video).toBeInTheDocument();
    })
})