'use client';
import { ReactElement, useState, useEffect, FormEvent } from "react";
import styles from "../styles/login.module.css";
import { ApiURL } from "../config";
import { parseCookies, setCookie } from "nookies";
import { useRouter } from 'next/navigation'; 

export default function Login(): ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setMsgError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const { 'tokencookie': token } = parseCookies();
        if (token) {
            console.log('Usuário já autenticado');
        }
    }, []);

    const  handleSubmit = async (e :FormEvent) => {
        e.preventDefault();
        try {
    
          const response = await fetch(`${ApiURL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({email, password})
          })
      
          if (response){
            const data = await response.json();
            const {erro, mensagem, token} = data
            console.log(data)
            if (erro){
              setMsgError(mensagem)
            } else {
              setCookie(undefined, 'tokencookie', token, {
                maxAge: 60*60*1
              })
              router.push('/')
            }
          }
        } catch (error) {
          console.error('Erro na requisicao', error)
        }
    
        console.log('Email:', email);
        console.log('Senha:', password);
      };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
            <button type="submit">Entrar</button>
        </form>
    );
};