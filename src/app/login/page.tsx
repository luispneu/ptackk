'use client';
import Image from "next/image";
import { ReactElement, useState } from "react";
import styles from "../styles/login.module.css";
import { useRouter } from "next/navigation";
import Usuario from "../interfaces/usuario";

export default function Login(): ReactElement {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [erro, setErro] = useState<string | null>(null);

    const { push } = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await fetch("https://prof-jeferson.github.io/API-reservas/usuarios.json")
            if( !response){
                console.log("Erro ao buscar")
            }
            const usuarios = await response.json();

            const usuarioConvertidos : Usuario[] = usuarios as Usuario[]

            if(!usuarios){
                console.log("Erro ao buscar")
            }else{
                const user = usuarios.find((user) => user.email == email && user.senha == senha)
                localStorage.setItem("usuario", JSON.stringify(user))
                router.push('/home')

                console.log(user)   
            }


        } catch {

        }


        

    };

    const handleForgotPassword = () => {
        alert('Esqueceu a senha?');
    };

    const handleSignUp = () => {
        push("/cadastro");
    };

    return (
        <>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h1 className={styles.titulo}>ACESSE SUA CONTA</h1>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                </div>
                {erro && (
                    <div className={styles.errorMessage}>
                        {erro}
                    </div>
                )}
                <div className={styles.formGroup}>
                    <button type="button" onClick={handleLogin}>Acessar Conta</button>
                </div>
                <div className={styles.formGroup}>
                    <a href="#" onClick={handleForgotPassword}>Esqueceu a senha?</a>
                </div>
                <div className={styles.formGroup}>
                    <button type="button" onClick={handleSignUp}>Não tem conta? Cadastre-se!</button>
                </div>
            </form>
        </>
    );
}
