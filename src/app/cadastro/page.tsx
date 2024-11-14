"use client";
import React, { useState } from "react";
import styles from "../styles/cadastro.module.css";
import { useRouter } from "next/navigation";
import Usuario from '../interfaces/usuario';
import { ApiURL } from "../config";

export default function Cadastro() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario>({
        nome: '',
        email: '',
        password: '',
        tipo: "cliente"
    });
    const [mensagem, setMensagem] = useState<string | null>(null);

    const alterarNome = (novoNome: string) => {
        setUsuario((valoresAnteriores) => ({
            ...valoresAnteriores,
            nome: novoNome
        }));
    };

    const alterarEmail = (novoEmail: string) => {
        setUsuario((valoresAnteriores) => ({
            ...valoresAnteriores,
            email: novoEmail
        }));
    };

    const alterarPassword = (novaSenha: string) => {
        setUsuario((valoresAnteriores) => ({
            ...valoresAnteriores,
            password: novaSenha
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${ApiURL}/auth/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
            const data = await response.json();

            if (data.erro) {
                setMensagem(data.mensagem);
            } else {
                setMensagem("Cadastro realizado com sucesso!");
                router.push("/");
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            setMensagem("Ocorreu um erro no cadastro. Tente novamente.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1 className={styles.titulo}>CADASTRE SUA CONTA</h1>
                <div className={styles.formGroup}>
                    <label htmlFor="nome" className={styles.label}>Nome</label>
                    <input
                        type="text"
                        id="nome"
                        className={styles.input}
                        value={usuario.nome}
                        onChange={(e) => alterarNome(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={usuario.email}
                        onChange={(e) => alterarEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        value={usuario.password}
                        onChange={(e) => alterarPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.button}>Cadastrar</button>
                </div>
                {mensagem && <p className={styles.feedback}>{mensagem}</p>}
            </form>
        </>
    );
}
