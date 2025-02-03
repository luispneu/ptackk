"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import { ApiURL } from "../config";
import styles from "../styles/perfil.module.css";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<{ nome: string; email: string; tipo: string } | null>(null);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(false);
  const [nomeTemp, setNomeTemp] = useState("");
  const [emailTemp, setEmailTemp] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPerfil = async () => {
      const { token } = parseCookies();
      if (!token) return router.push("/login");

      const response = await fetch(`${ApiURL}/perfil`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.erro) {
        setError(data.mensagem);
      } else {
        setUsuario(data.usuario);
      }
    };

    fetchPerfil();
  }, [router]);

  const handleLogout = () => {
    destroyCookie(null, "token");
    router.push("/");
  };

  const handleAtualizarPerfil = async () => {
    const { token } = parseCookies();
    if (!token) return router.push("/login");

    setError("");

    const response = await fetch(`${ApiURL}/perfil`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nomeTemp, email: emailTemp }),
    });

    const data = await response.json();

    if (data.erro) {
      setError(data.mensagem);
    } else {
      setUsuario(data.usuario);
      setEditando(false);
    }
  };

  const handleVoltar = () => {
    router.push("/reservas");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Meu Perfil</h2>
        {error && <p className={styles.error}>{error}</p>}
        {usuario ? (
          <>
            {editando ? (
              <>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Nome:</label>
                  <input
                    type="text"
                    value={nomeTemp}
                    onChange={(e) => setNomeTemp(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Email:</label>
                  <input
                    type="email"
                    value={emailTemp}
                    onChange={(e) => setEmailTemp(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <button className={styles.button} onClick={handleAtualizarPerfil}>
                  Salvar
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <div className={styles.info}>
                  <p>
                    <strong>Nome:</strong> {usuario.nome}
                  </p>
                </div>
                <div className={styles.info}>
                  <p>
                    <strong>Email:</strong> {usuario.email}
                  </p>
                </div>
                <div className={styles.info}>
                  <p>
                    <strong>Tipo:</strong> {usuario.tipo === "adm" ? "Administrador" : "Cliente"}
                  </p>
                </div>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setEditando(true);
                    setNomeTemp(usuario.nome);
                    setEmailTemp(usuario.email);
                  }}
                >
                  Alterar Dados
                </button>
                <button className={styles.voltarButton} onClick={handleVoltar}>
                  Voltar
                </button>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Sair
                </button>
              </>
            )}
          </>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </div>
    </div>
  );
}