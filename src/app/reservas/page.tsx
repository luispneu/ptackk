"use client"
import Image from "next/image";
import { ChangeEvent, useState } from "react";

export default function Home() {
  function getDateNow() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  const [selectedTable, setSelectedTable] = useState(null);
  const [dateTables, setDateTables] = useState(getDateNow);
  const tables = [{ id: 1, nome: "Mesa 1" }, { id: 2, nome: "Mesa 2" }, { id: 3, nome: "Mesa 3" }];
  const reservas = [
    { id: 1, mesa: 1, data: "2024-11-29" },
    { id: 2, mesa: 2, data: "2024-11-29" },
    { id: 3, mesa: 2, data: "2024-11-28" },
  ];

  function handleChangeDate(e: ChangeEvent<HTMLInputElement>) {
    setDateTables(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <style jsx>{`
        .user-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 16px;
          text-align: center;
        }

        .user-card img {
          border: 4px solid #6366f1;
          border-radius: 50%;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 16px;
        }

        .button-reserve {
          background-color: #4f46e5;
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
        }

        .button-reserve:hover {
          background-color: #4338ca;
        }

        .button-reserve.red {
          background-color: #ef4444;
        }

        .button-reserve.red:hover {
          background-color: #dc2626;
        }

        .reservation-form label {
          font-weight: bold;
        }

        .reservation-form input {
          padding: 8px;
          margin-top: 4px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .reservation-form button {
          margin-top: 16px;
        }
      `}</style>

      <div className="w-full lg:w-1/4 p-4">
        <div className="user-card">
          <img
            src="https://github.com/MrMinerin.png"
            alt="Usuário"
            className="w-24 h-24 mx-auto"
          />
          <h2 className="text-lg font-bold mt-4">Jéferson Carlos de Souza</h2>
          <p className="text-gray-600">Cliente</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white p-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Mesas Disponíveis</h2>
          <label className="flex flex-col">
            <input
              type="date"
              value={dateTables}
              min={dateTables}
              className="p-2 border rounded"
              onChange={handleChangeDate}
            />
          </label>
        </div>

        <div className="tables-grid mt-4">
          {tables.map((table) => {
            const isReserved = reservas.some(
              (reserva) => dateTables === reserva.data && reserva.mesa === table.id
            );

            return (
              <button
                key={table.id}
                className={`button-reserve ${isReserved ? "red" : ""}`}
                onClick={() => setSelectedTable(table.nome)}
              >
                {table.nome}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-1/4 bg-gray-100 p-4 border-t lg:border-t-0 lg:border-l">
        {selectedTable ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Reservar {selectedTable}</h2>
            <form className="reservation-form flex flex-col space-y-4">
              <label className="flex flex-col">
                Nome:
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Seu nome"
                />
              </label>
              <label className="flex flex-col">
                Data:
                <input
                  type="date"
                  className="p-2 border rounded"
                />
              </label>
              <label className="flex flex-col">
                Pessoas:
                <input
                  type="number"
                  max={4}
                  min={1}
                  className="p-2 border rounded"
                />
              </label>
              <button
                type="submit"
                className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-700">Selecione uma mesa para reservar</p>
        )}
      </div>
    </div>
  );
}
