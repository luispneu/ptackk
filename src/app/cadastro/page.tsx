"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiURL } from "../config";
import styles from "../styles/cadastro.module.css";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (nome.length < 6 || email.length < 10 || password.length < 8) {
      setError("Nome, email ou senha inválidos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const response = await fetch(`${ApiURL}/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });

    const data = await response.json();

    if (data.erro) {
      setError(data.mensagem);
    } else {
      setSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Cadastro</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form onSubmit={handleCadastro} className={styles.form}>
          <label className={styles.label}>Nome Completo</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Nome completo"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <label className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className={styles.label}>Senha</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <label className={styles.label}>Confirmar Senha</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.button}>Cadastrar</button>
        </form>

        <p className={styles.signupText}>
          Já tem uma conta?{" "}
          <a href="/login" className={styles.link}>
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
