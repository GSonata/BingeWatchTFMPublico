import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserPageComponent from "../../component/UserPageComponent";
import axios from "axios";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

// Subcomponentes mock
jest.mock("../../component/Subcomponentes/BannerComponent", () => () => <div data-testid="banner" />);
jest.mock("../../component/Subcomponentes/FooterComponent", () => () => <div data-testid="footer" />);
jest.mock("../../component/UserBadgesComponent", () => () => <div data-testid="badges" />);
jest.mock("../../component/UserHistoryComponent", () => () => <div data-testid="history" />);

// Definir baseUrl para los tests
beforeAll(() => {
    process.env.REACT_APP_API_URL = "http://localhost";
});

afterEach(() => {
    jest.clearAllMocks(); // limpia axios, Swal, etc.
});

describe("UserPageComponent", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes("history")) {
                return Promise.resolve({
                    data: {
                        coleccion: [{ title: "Test Movie" }],
                        peliculasVistas: [{ title: "Watched" }],
                        watchlist: []
                    }
                });
            }
            if (url.includes("check-session")) {
                return Promise.resolve({
                    data: {
                        user: {
                            alias: "Juanito",
                            imagenPerfil: "emptyImageUser"
                        }
                    }
                });
            }
        });
    });

    test("renderiza correctamente tras cargar datos", async () => {
        render(<UserPageComponent />);

        expect(screen.getByText("Cargando perfil...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        expect(screen.getByTestId("banner")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
        expect(screen.getByTestId("badges")).toBeInTheDocument();
        expect(screen.getByTestId("history")).toBeInTheDocument();
        expect(screen.getByText("Colección")).toBeInTheDocument();
        expect(screen.getAllByText("1")).toHaveLength(2); // colección y vistas
    });

    test("permite cambiar alias", async () => {
        Swal.fire.mockResolvedValue({ value: "NuevoAlias" });
        axios.put.mockResolvedValue({});

        render(<UserPageComponent />);

        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle("Editar alias"));
        await waitFor(() => expect(Swal.fire).toHaveBeenCalled());

        expect(axios.put).toHaveBeenCalledWith(
            "http://localhost/user/update-alias",
            { newAlias: "NuevoAlias" },
            { withCredentials: true }
        );
    });

    test("no cambia alias si es el mismo", async () => {
        Swal.fire.mockResolvedValue({ value: "Juanito" });
        axios.put.mockClear();

        render(<UserPageComponent />);

        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle("Editar alias"));
        await waitFor(() => expect(Swal.fire).toHaveBeenCalled());

        expect(axios.put).not.toHaveBeenCalled();
    });

    test("muestra error al fallar cambio de alias", async () => {
        Swal.fire.mockResolvedValue({ value: "NuevoAlias" });
        axios.put.mockRejectedValue(new Error("Error"));

        render(<UserPageComponent />);

        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle("Editar alias"));
        await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    });

    test("handleImageChange no hace nada si no se selecciona archivo", async () => {
        render(<UserPageComponent />);

        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        const input = screen.getByLabelText("Subir imagen");
        fireEvent.change(input, { target: { files: [] } });

        expect(axios.put).not.toHaveBeenCalled();
    });

    test("no hace nada si el usuario cancela el cambio de alias", async () => {
        Swal.fire.mockResolvedValue({ isConfirmed: false }); // usuario cancela

        render(<UserPageComponent />);
        await waitFor(() => {
            expect(screen.getByText(/@Juanito/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle("Editar alias"));
        await waitFor(() => expect(Swal.fire).toHaveBeenCalled());

        expect(axios.put).not.toHaveBeenCalled();
    });

    test("muestra error en consola si falla la carga de datos", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        axios.get.mockRejectedValueOnce(new Error("Error de red"));

        render(<UserPageComponent />);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error al obtener los datos del usuario:",
                "Error de red"
            );
        });

        consoleSpy.mockRestore();
    });


});
