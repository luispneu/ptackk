import Link from "next/link";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { ApiURL } from "../config";
import styles from "../styles/menu.module.css";
import { useRouter, usePathname } from "next/navigation";

export default function Menu({ onMinhasReservasClick }: { onMinhasReservasClick?: () => void }) {
  const [usuario, setUsuario] = useState<{ nome: string; email: string; tipo: string } | null>(null);
  const [popupAberto, setPopupAberto] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchPerfil = async () => {
      const { token } = parseCookies();
      if (!token) return;

      fetch(`${ApiURL}/perfil`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) setUsuario(data.usuario);
        });
    };

    fetchPerfil();
  }, []);

  const handleAdminClick = () => {
    if (usuario?.tipo === "adm") {
      router.push("/admin");
    } else {
      setPopupAberto(true);
      setTimeout(() => setPopupAberto(false), 3000);
    }
  };

  const handleMinhasReservasClick = () => {
    if (onMinhasReservasClick) {
      onMinhasReservasClick();
    } else {
      router.push("/reserva");
    }
  };

  // Verifica se o Menu está sendo renderizado na página /admin
  const isAdminPage = pathname.includes("/admin");

  return (
    <div className={styles.menu}>
      <div className={styles.menuContent}>
        <h2 className={styles.profileName}>{usuario?.nome || "Usuário"}</h2>
        <Link href="/perfil" className={styles.menuButton}>Perfil</Link>

        {/* Botão "Minhas Reservas" */}
        {isAdminPage ? (
          <Link href="/reservas" className={styles.menuButton}>Fazer Reserva</Link>
        ) : (
          <button onClick={handleMinhasReservasClick} className={styles.menuButton}>Minhas Reservas</button>
        )}

        {usuario?.tipo === "adm" && !pathname.includes("/admin") && (
          <button onClick={handleAdminClick} className={styles.menuButton}>Admin</button>
        )}
      </div>

      {popupAberto && (
        <div className={styles.popup}>
          <p>Acesso restrito para administradores.</p>
        </div>
      )}
    </div>
  );
}