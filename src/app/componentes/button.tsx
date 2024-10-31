import React from 'react';

type ButtonProps = {
    funcao: () => void,
    texto: string
}
const Button2: React.FC<ButtonProps> = ({funcao, texto})=>{
    return(
        <button type="button" onClick={funcao}>{texto}</button>
    )
}

export default Button2;