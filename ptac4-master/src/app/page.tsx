"use client"
import { useRouter } from 'next/navigation'; 
import styles from './page.module.css'; 
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/cadastro");
  };

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>LA TABLE D'OR</h1>
          <div className={styles.buttonGroup}>
            <button className={styles.loginButton} onClick={handleLogin}>Login</button>
            <button className={styles.signUpButton} onClick={handleSignUp}>Efetuar Cadastro</button>
          </div>
        </main>
      </div>
    </div>
  );
}
