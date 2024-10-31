import PerfilUsuario from "../interfaces/usuario";

const Perfil = () => {
    const usuario = {
        nome: "Izi",
        email: "i@perfil.com",
        idade: 18
    };
    
    return (
        <div>
            <PerfilUsuario usuario={usuario} />
        </div>
    );
};

export default Perfil;
