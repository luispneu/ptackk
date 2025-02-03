"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseCookies, setCookie } from "nookies";
import { ApiURL } from "../config";
import styles from "../styles/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { token } = parseCookies();
    if (token) router.push("/reservas");

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    const response = await fetch(`${ApiURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.erro) {
      setError(data.mensagem);
    } else {
      setCookie(null, "token", data.token, { maxAge: 3600, path: "/" });

      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/reservas");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleLogin} className={styles.form}>
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

          <div className={styles.rememberContainer}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className={styles.checkbox}
            />
            <label htmlFor="remember" className={styles.rememberLabel}>Lembrar-se</label>
          </div>

          <button type="submit" className={styles.button}>LOGIN</button>
        </form>

        <p className={styles.signupText}>
          <Link href="/cadastro" className={styles.link}>
          Não tenho uma conta
          </Link>
        </p>
      </div>
    </div>
  );
}
