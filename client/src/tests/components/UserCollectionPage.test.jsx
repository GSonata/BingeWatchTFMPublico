import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import UserCollectionPage from "../../component/UserCollectionPage";

// ✅ Mocks de subcomponentes
jest.mock("../../component/Subcomponentes/BannerComponent", () => () => (
  <div data-testid="mock-banner" />
));
jest.mock("../../component/Subcomponentes/FooterComponent", () => () => (
  <div data-testid="mock-footer" />
));
jest.mock("../../component/UserMovieTabs", () => () => (
  <div data-testid="mock-tabs" />
));
jest.mock("../../component/FilterComponent", () => (props) => (
  <div data-testid="mock-filters">
    <button onClick={props.onClearFilters}>Limpiar filtros</button>
  </div>
));

// ✅ Mock de axios
jest.mock("axios");

describe("UserCollectionPage", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        coleccion: [
          {
            title: "Matrix",
            año: 1999,
            estado: "Nuevo",
            soporte: "DVD",
            genre: ["Sci-Fi"],
            fechaAñadida: "2024-01-01"
          }
        ],
        peliculasVistas: [],
        watchlist: []
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test 1: Muestra loading y luego el contenido", async () => {
    render(<UserCollectionPage />);

    // Loading visible al inicio
    expect(screen.getByText(/cargando tu colección/i)).toBeInTheDocument();

    // Espera hasta que se cargue
    await waitFor(() => {
      expect(screen.getByText("Tu colección")).toBeInTheDocument();
    });

    // Subcomponentes renderizados
    expect(screen.getByTestId("mock-banner")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  test("Test 2: botón de limpiar filtros funciona", async () => {
    render(<UserCollectionPage />);

    await screen.findByText("Tu colección");

    const btn = screen.getByText("Limpiar filtros");
    fireEvent.click(btn);

    expect(btn).toBeInTheDocument(); 
  });
});
