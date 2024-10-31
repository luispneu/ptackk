interface Usuario {
    nome: string,
    email: string,
    idade?: number,
    id?: number,
    password: string,
    tipo?: "cliente" | "adm"
}

export default Usuario;
