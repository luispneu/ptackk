interface Reserva{
    id: number,
    usuario_id: number,
    mesa_id: number,
    data: Date,
    n_pessoas:number,
    status: boolean
}

export default Reserva;