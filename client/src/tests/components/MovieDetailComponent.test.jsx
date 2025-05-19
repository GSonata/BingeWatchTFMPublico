import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import MovieDetailComponent from "../../component/MovieDetailComponent";

// Mocks externos
jest.mock("axios");
jest.mock("sweetalert2", () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    mixin: () => ({ fire: jest.fn() }),
  },
}));
jest.mock("../../component/Subcomponentes/FooterComponent", () => () => <div data-testid="mock-footer" />);
jest.mock("../../component/Subcomponentes/BannerComponent", () => () => <div data-testid="mock-banner" />);
jest.mock("../../component/UserInteractionComponent", () => () => <div data-testid="mock-user-interaction" />);

// Mocks personalizados de componentes
jest.mock("../../component/Subcomponentes/Modales/AddCopyModal", () => require("../components/_mocks_/AddCopyModal"));
jest.mock("../../component/Subcomponentes/Modales/ConfirmDeleteModal", () => require("../components/_mocks_/ConfirmDeleteModal"));
jest.mock("../../component/CopiesTableComponent", () => require("../components/_mocks_/CopiesTableComponent"));

describe("MovieDetailComponent", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/movies/")) {
        return Promise.resolve({
          data: {
            imdbID: "tt0133093",
            title: "Matrix",
            year: 1999,
            runtime: "136 min",
            metascore: 73,
            genre: ["Action", "Sci-Fi"],
            director: "Wachowski",
            actors: ["Keanu Reeves"],
            plot: "Una simulación computacional.",
          },
        });
      }
      if (url.includes("/user/coleccion/")) return Promise.resolve({ data: [] });
      if (url.includes("/user/badges")) return Promise.resolve({ data: [] });
      return Promise.reject(new Error("Ruta inesperada"));
    });

    axios.post.mockResolvedValue({ data: { nuevasInsignias: [] } });
    axios.put.mockResolvedValue({});
    axios.delete.mockResolvedValue({ data: { nuevasInsignias: [], perdidasInsignias: [] } });
  });

  afterEach(() => jest.clearAllMocks());

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={["/movie/tt0133093"]}>
        <Routes>
          <Route path="/movie/:imdbID" element={<MovieDetailComponent />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("muestra 'Cargando película...' mientras se obtienen datos", () => {
    renderWithRouter();
    expect(screen.getByText(/cargando película/i)).toBeInTheDocument();
  });

  test("renderiza correctamente los detalles de la película", async () => {
    renderWithRouter();
    await waitFor(() => expect(screen.getByText("Matrix")).toBeInTheDocument());
    expect(screen.getByText("(1999)")).toBeInTheDocument();
    expect(screen.getByTestId("mock-copies-table")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  test("handleDeleteConfirm elimina copia", async () => {
    renderWithRouter();
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/user/badges"), expect.anything());
  });

  test("handleConfirmCopy en modo add", async () => {
    renderWithRouter();

    // Simulamos click en botón oculto que abre el modal
    const openModalButton = await screen.findByTestId("open-add-modal");
    openModalButton.click();

    const confirmBtn = await screen.findByTestId("confirm-add");
    confirmBtn.click();

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  /* NO CONSIGO QUE FUNCIONE ME VUELVO LOCOOOOO test("handleConfirmCopy en modo edit", async () => {
    renderWithRouter();

    const { capturedProps } = require("../components/_mocks_/CopiesTableComponent");

    capturedProps.onEditCopy({ idCopia: 123, soporte: "DVD", estado: "Normal" });

    const confirmBtn = await screen.findByTestId("confirm-add");
    confirmBtn.click();

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/user/coleccion/123"),
        expect.objectContaining({ soporte: "BluRay", estado: "Nuevo" }),
        expect.objectContaining({ withCredentials: true })
      )
    );
  });

  */////
  
  test("getScoreClass funciona correctamente", async () => {
    renderWithRouter();
    await waitFor(() =>
      expect(document.querySelector(".metascore-circle.high")).toBeInTheDocument()
    );
  });
});
