import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AllBadgesModal from "../../component/AllBadgesModal";

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/badges/all")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "badge_1",
              nombre: "Coleccionista",
              descripcion: "Consigue 10 películas",
              imagen: "badge1.png",
            },
            {
              id: "badge_2",
              nombre: "Reto de marzo",
              descripcion: "Ver 5 películas en marzo",
              imagen: "badge2.png",
            },
            {
              id: "Insignia_Mes",
              nombre: "Del mes",
              descripcion: "Exclusiva mensual",
              imagen: "monthly.png",
            },
          ]),
      });
    }

    if (url.includes("/user/badges")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "badge_1",
              fechaAdquisicion: "2024-06-01T00:00:00.000Z",
            },
          ]),
      });
    }
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AllBadgesModal", () => {
  test("renderiza insignias correctamente (sin cobertura completa)", async () => {
    render(<AllBadgesModal onClose={jest.fn()} />);

    // 🧼 Espera automática sin act
    const visibleBadge = await screen.findByText("Coleccionista");

    expect(visibleBadge).toBeInTheDocument();
    expect(screen.getByText("Reto de marzo")).toBeInTheDocument();
    expect(screen.queryByText("Del mes")).not.toBeInTheDocument();

    expect(screen.getByText("Consigue 10 películas")).toBeInTheDocument();
    expect(screen.getByText("Ver 5 películas en marzo")).toBeInTheDocument();
    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  test("cierra el modal al hacer clic en el botón ❌", () => {
    const handleClose = jest.fn();

    render(<AllBadgesModal onClose={handleClose} />);
    fireEvent.click(screen.getByRole("button", { name: "❌" }));

    expect(handleClose).toHaveBeenCalled();
  });
});
