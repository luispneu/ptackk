"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { ApiURL } from "../config";
import Menu from "../components/Menu";
import styles from "../styles/admin.module.css";

export default function PainelAdmin() {
  const [usuario, setUsuario] = useState<{ tipo: string } | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("cadastrarMesas");

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
        .then((res) => res.json())
        .then((data) => {
          if (data.usuario?.tipo !== "adm") {
            setMensagem("Acesso negado.");
          } else {
            setUsuario(data.usuario);
          }
        });
    };

    fetchPerfil();
  }, []);

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
            onClick={() => setAbaAtiva("listarUsuarios")}
            className={`${styles.tabButton} ${abaAtiva === "listarUsuarios" ? styles.active : ""}`}
          >
            Listar Usuários
          </button>
        </div>

        <div className={styles.content}>
          {abaAtiva === "cadastrarMesas" && <CadastrarMesas />}
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