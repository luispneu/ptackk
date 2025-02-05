'use client';
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { ApiURL } from "../config";
import Menu from "../components/Menu";
import styles from "../styles/admin.module.css";

export default function PainelAdmin() {
  const [usuario, setUsuario] = useState<{ tipo: string } | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("cadastrarMesas");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");

  useEffect(() => {
    const fetchPerfil = async () => {
      const { token } = parseCookies();
      if (!token) {
        setMensagem("Acesso negado.");
        return;
      }
      fetch(`${ApiURL}/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erro ao buscar perfil");
          }
          return res.json();
        })
        .then((data) => {
          if (data.usuario?.tipo !== "adm") {
            setMensagem("Acesso negado.");
          } else {
            setUsuario(data.usuario);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar perfil:", error);
          setMensagem("Erro ao buscar perfil.");
        });
    };
    fetchPerfil();
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      const { token } = parseCookies();
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        let url = `${ApiURL}/reservas/geral`;
        if (dataFiltro) {
          url += `?data=${encodeURIComponent(dataFiltro)}`;
        }
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.text();
          try {
            const jsonError = JSON.parse(errorData);
            throw new Error(jsonError.mensagem || "Erro ao buscar reservas.");
          } catch (parseError) {
            throw new Error(errorData || "Erro ao buscar reservas.");
          }
        }
        const data = await response.json();
        setReservas(data.reservas || []);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        setError("Erro ao buscar reservas.");
      } finally {
        setLoading(false);
      }
    };
    if (abaAtiva === "listarReservas") {
      fetchReservas();
    }
  }, [abaAtiva, dataFiltro]);

  if (mensagem) {
    return <p className={styles.error}>{mensagem}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <Menu />
      </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>Painel Administrativo</h2>
        <div className={styles.tabs}>
          <button
            onClick={() => setAbaAtiva("cadastrarMesas")}
            className={`${styles.tabButton} ${abaAtiva === "cadastrarMesas" ? styles.active : ""}`}
          >
            Cadastrar Mesas
          </button>
          <button
            onClick={() => setAbaAtiva("editarMesas")}
            className={`${styles.tabButton} ${abaAtiva === "editarMesas" ? styles.active : ""}`}
          >
            Editar Mesas
          </button>
          <button
            onClick={() => setAbaAtiva("listarReservas")}
            className={`${styles.tabButton} ${abaAtiva === "listarReservas" ? styles.active : ""}`}
          >
            Listar Reservas
          </button>
          <button
            onClick={() => setAbaAtiva("listarUsuarios")}
            className={`${styles.tabButton} ${abaAtiva === "listarUsuarios" ? styles.active : ""}`}
          >
            Listar Usuários
          </button>
        </div>
        <div className={styles.content}>
          {abaAtiva === "cadastrarMesas" && <CadastrarMesas />}
          {abaAtiva === "editarMesas" && <EditarMesas />}
          {abaAtiva === "listarReservas" && (
            <div className={styles.listarReservas}>
              <h3>Listar Reservas</h3>
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                placeholder="Filtrar por data"
                className={styles.input}
              />
              {loading ? (
                <p>Carregando reservas...</p>
              ) : error ? (
                <p className={styles.error}>{error}</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Data</th>
                      <th>Número de Pessoas</th>
                      <th>Mesa ID</th>
                      <th>Usuário ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva) => (
                      <tr key={reserva.id}>
                        <td>{reserva.id}</td>
                        <td>{new Date(reserva.data).toLocaleDateString()}</td>
                        <td>{reserva.n_pessoas}</td>
                        <td>{reserva.mesaId}</td>
                        <td>{reserva.usuarioId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {abaAtiva === "listarUsuarios" && <ListarUsuarios />}
        </div>
      </div>
    </div>
  );
}

function CadastrarMesas() {
  const [codigo, setCodigo] = useState("");
  const [n_lugares, setNLugares] = useState("");
  const [mensagem, setMensagem] = useState("");
  const handleCadastro = async () => {
    const { token } = parseCookies();
    const response = await fetch(`${ApiURL}/mesa/novo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ codigo, n_lugares }),
    });
    if (response.ok) {
      setMensagem("Mesa cadastrada com sucesso!");
      setCodigo("");
      setNLugares("");
    } else {
      const errorData = await response.json();
      console.error("Erro na resposta:", errorData);
      setMensagem("Erro ao cadastrar mesa.");
    }
  };
  return (
    <div className={styles.cadastrarMesas}>
      <h3>Cadastrar Nova Mesa</h3>
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Código da Mesa"
        className={styles.input}
      />
      <input
        type="number"
        value={n_lugares}
        onChange={(e) => setNLugares(e.target.value)}
        placeholder="Número de Lugares"
        className={styles.input}
      />
      <button onClick={handleCadastro} className={styles.button}>
        Cadastrar
      </button>
      {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
    </div>
  );
}

function EditarMesas() {
  const [mesas, setMesas] = useState<{ id: number; codigo: string; n_lugares: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchMesas = async () => {
      const { token } = parseCookies();
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${ApiURL}/mesa`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensagem || "Erro ao buscar mesas.");
        }
        const data = await response.json();
        setMesas(data.mesas || []);
      } catch (error) {
        console.error("Erro ao buscar mesas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMesas();
  }, []);
  const handleAtualizarMesa = async (id: number, codigo: string, n_lugares: number) => {
    const { token } = parseCookies();
    const response = await fetch(`${ApiURL}/mesa/atualizar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, codigo, n_lugares }),
    });
    if (response.ok) {
      alert("Mesa atualizada com sucesso!");
      // Atualizar a lista de mesas após a edição
      const updatedMesas = mesas.map(mesa => 
        mesa.id === id ? { ...mesa, codigo, n_lugares } : mesa
      );
      setMesas(updatedMesas);
    } else {
      const errorData = await response.json();
      alert(errorData.mensagem || "Erro ao atualizar mesa.");
    }
  };
  if (loading) {
    return <p>Carregando mesas...</p>;
  }
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  return (
    <div className={styles.editarMesas}>
      <h3>Editar Mesas</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Número de Lugares</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.id}</td>
              <td>
                <input
                  type="text"
                  defaultValue={mesa.codigo}
                  onChange={(e) => {
                    const updatedMesas = mesas.map(m => 
                      m.id === mesa.id ? { ...m, codigo: e.target.value } : m
                    );
                    setMesas(updatedMesas);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={mesa.n_lugares}
                  onChange={(e) => {
                    const updatedMesas = mesas.map(m => 
                      m.id === mesa.id ? { ...m, n_lugares: parseInt(e.target.value) } : m
                    );
                    setMesas(updatedMesas);
                  }}
                />
              </td>
              <td>
                <button
                  onClick={() => handleAtualizarMesa(mesa.id, mesa.codigo, mesa.n_lugares)}
                  className={styles.button}
                >
                  Salvar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState<{ id: number; nome: string; email: string; tipo: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUsuarios = async () => {
      const { token } = parseCookies();
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${ApiURL}/perfil/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensagem || "Erro ao buscar usuários.");
        }
        const data = await response.json();
        setUsuarios(data.usuarios || []);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);
  if (loading) {
    return <p>Carregando usuários...</p>;
  }
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  return (
    <div className={styles.listarUsuarios}>
      <h3>Lista de Usuários</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo === "adm" ? "Administrador" : "Cliente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}