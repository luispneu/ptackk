"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles/page.module.css";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/reservas");
        }
    }, [router]);

    return (
      <div className={styles.container}>
      <div className={styles.imageSection}></div>

      <div className={styles.formSection}>
          <div className={styles.card}>
              <h1 className={styles.title}>Bem-vindo ao Sistema de Reservas</h1>
              <p className={styles.text}>Acesse para fazer sua reserva.</p>

              <button className={styles.button} onClick={() => router.push("/login")}>
                  Login
              </button>
              <Link href="/cadastro">
                  <button className={styles.buttonSecondary}>Cadastrar-se</button>
              </Link>
          </div>
      </div>
  </div>
);
}
