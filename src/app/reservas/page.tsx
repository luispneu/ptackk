"use client";

import { useState, useEffect } from "react";
import { ApiURL } from "../config";
import Menu from "../components/Menu";
import styles from "../styles/reservas.module.css";
import { parseCookies } from "nookies";

export default function ReservasCliente() {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<{ id: number; codigo: string } | null>(null);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [nPessoas, setNPessoas] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exibirMinhasReservas, setExibirMinhasReservas] = useState(false);

  const fetchMesas = async (data: string) => {
    try {
      const response = await fetch(`${ApiURL}/mesa/disponibilidade?data=${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao buscar mesas");
      }
      const dataResponse = await response.json();
      setMesas(dataResponse.mesas || []);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    }
  };

  const fetchMinhasReservas = async () => {
    try {
      const { token } = parseCookies();

      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch(`${ApiURL}/reservas/minhas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao buscar reservas");
      }

      const dataResponse = await response.json();
      setReservas(dataResponse.reservas || []);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  };

  useEffect(() => {
    if (!exibirMinhasReservas) {
      fetchMesas(data);
    }
  }, [data, exibirMinhasReservas]);

  useEffect(() => {
    if (exibirMinhasReservas) {
      fetchMinhasReservas();
    }
  }, [exibirMinhasReservas]);

  const handleOpenModal = (mesa: { id: number; codigo: string }) => {
    setSelectedMesa(mesa);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMesa(null);
    setNPessoas("");
    setError("");
  };

  const handleReserva = async () => {
    setLoading(true);
    setError("");

    const selectedDate = new Date(data);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      setError("A data da reserva não pode ser anterior à data atual.");
      setLoading(false);
      return;
    }

    if (!selectedMesa || !nPessoas || !data) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    const { token } = parseCookies();

    if (!token) {
      setError("Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const dataReserva = new Date(data).toISOString();

      const response = await fetch(`${ApiURL}/reservas/novo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mesaId: selectedMesa.id,
          n_pessoas: parseInt(nPessoas),
          data: dataReserva,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao fazer reserva");
      }

      const dataResponse = await response.json();
      alert(dataResponse.mensagem);
      handleCloseModal();
      fetchMesas(data);
    } catch (error) {
      console.error("Erro ao fazer reserva:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarReserva = async (reservaId: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      const { token } = parseCookies();

      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch(`${ApiURL}/reservas/cancelar`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservaId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao cancelar reserva");
      }

      const dataResponse = await response.json();
      alert(dataResponse.mensagem);
      fetchMinhasReservas();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const toggleExibirMinhasReservas = () => {
    setExibirMinhasReservas(!exibirMinhasReservas);
  };

  return (
    <div className={styles.container}>
      <Menu onMinhasReservasClick={toggleExibirMinhasReservas} />
      <div className={styles.mainContent}>
        <h2 className={styles.title}>{exibirMinhasReservas ? "Minhas Reservas" : "Reservas"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        {exibirMinhasReservas ? (
          <div className={styles.reservasContainer}>
            {reservas.map((reserva) => (
              <div key={reserva.id} className={styles.reserva}>
                <p>Mesa: {reserva.mesa.codigo}</p>
                <p>Data: {new Date(reserva.data).toLocaleDateString()}</p>
                <p>Número de Pessoas: {reserva.n_pessoas}</p>
                <button
                  className={styles.editarButton}
                  onClick={() => handleOpenModal(reserva)}
                >
                  Editar
                </button>
                <button
                  className={styles.cancelarButton}
                  onClick={() => handleCancelarReserva(reserva.id)}
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={styles.filterContainer}>
              <label htmlFor="data">Data:</label>
              <input
                type="date"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={styles.dateInput}
              />
            </div>

            <div className={styles.mesasContainer}>
              {mesas.map((mesa: any) => {
                const isReservada = mesa.reservas && mesa.reservas.length > 0;
                return (
                  <div
                    key={mesa.id}
                    className={`${styles.mesa} ${isReservada ? styles.mesaReservada : ""}`}
                    onClick={() => !isReservada && handleOpenModal(mesa)}
                    title={isReservada ? `Reservada para ${mesa.reservas[0].n_pessoas} pessoas` : "Disponível"}
                  >
                    <p>Mesa {mesa.codigo}</p>
                    <p>Lugares: {mesa.n_lugares}</p>
                    {isReservada && <p>Ocupada</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showModal && selectedMesa && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                &times;
              </button>
              <h2 className={styles.modalTitle}>Reservar Mesa {selectedMesa.codigo}</h2>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={styles.modalInput}
                placeholder="Data da Reserva"
              />
              <input
                type="number"
                placeholder="Número de Pessoas"
                value={nPessoas}
                onChange={(e) => setNPessoas(e.target.value)}
                className={styles.modalInput}
              />
              {error && <p className={styles.modalError}>{error}</p>}
              <button
                className={styles.confirmButton}
                onClick={handleReserva}
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar Reserva"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}