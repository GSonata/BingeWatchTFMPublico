import React from 'react';

jest.mock('../../component/Subcomponentes/MovieCarouselComponent', () => () => (
  <div data-testid="mock-carousel" />
));

jest.mock('../../component/Subcomponentes/FooterComponent', () => () => (
  <div data-testid="mock-footer" />
));

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPageComponent from '../../component/MainPageComponent';

// ✅ Mock de IntersectionObserver para evitar errores en JSDOM
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("MainPageComponent", () => {
  test("Test 1: Renderiza correctamente los elementos principales: logo, botón y tarjetas intro", () => {
    render(
      <MemoryRouter>
        <MainPageComponent />
      </MemoryRouter>
    );

    // Logo
    expect(screen.getByAltText(/logo bingewatch/i)).toBeInTheDocument();

    // Botón de acción
    expect(
      screen.getByRole("link", { name: /empieza a coleccionar/i })
    ).toBeInTheDocument();

    // ✅ Verificamos los textos esperados en las tarjetas intro
    const introTexts = [
      "¿Qué es BingeWatch?",
      "¿Cómo funciona BingeWatch?",
      "¿Por qué BingeWatch?"
    ];

    introTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Test 2: Incluye los subcomponentes mockeados (Carrusel Peliculas y Footer)", () => {
    render(
      <MemoryRouter>
        <MainPageComponent />
      </MemoryRouter>
    );

    // ✅ Verifica que los mocks se hayan insertado
    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
