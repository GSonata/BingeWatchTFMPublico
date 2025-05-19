import React from "react";

// ✅ Mocks definidos antes del import del componente principal
jest.mock("../../component/Subcomponentes/BannerComponent", () => () => (
    <div data-testid="mock-banner" />
));

jest.mock("../../component/Subcomponentes/FAQComponent", () => () => (
    <div data-testid="mock-faq" />
));

jest.mock("../../component/Subcomponentes/MailComponent", () => () => (
    <div data-testid="mock-mail" />
));

jest.mock("../../component/Subcomponentes/FooterComponent", () => () => (
    <div data-testid="mock-footer" />
));

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "../../component/ContactPage";

// ✅ Mock del IntersectionObserver
beforeAll(() => {
    global.IntersectionObserver = jest.fn(function () {
        return {
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn()
        };
    });
});

describe("ContactPage", () => {
    test("Test 1: se renderiza correctamente con imagen, título y texto de ayuda", () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        // ✅ Imagen principal
        expect(screen.getByAltText("Imagen de ayuda")).toBeInTheDocument();

        // ✅ Título de ayuda
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("¿En qué podemos ayudar?");

        // ✅ Párrafo de ayuda
        expect(screen.getByText(/conéctate con nosotros/i)).toBeInTheDocument();
    });

    test("Test 2: incluye todos los subcomponentes mockeados", () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByTestId("mock-banner")).toBeInTheDocument();
        expect(screen.getByTestId("mock-faq")).toBeInTheDocument();
        expect(screen.getByTestId("mock-mail")).toBeInTheDocument();
        expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    });

    test("Test 3: aplica la clase visible cuando la sección entra en el viewport", () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        const observedSection = document.querySelector(".contactPart");

        // Simula una entrada visible en el observer
        const observerCallback = IntersectionObserver.mock.calls[0][0];
        observerCallback([
            {
                isIntersecting: true,
                target: observedSection,
            }
        ], {
            unobserve: jest.fn()
        });

        expect(observedSection.classList.contains("visible")).toBe(true);
    });

});
