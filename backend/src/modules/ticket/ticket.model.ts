import { Document, Schema, Types, model } from 'mongoose'

//Aca estamos definiendo los estados 
//Estados : | A. Mesa de ayuda | Ticket | `ABIERTO`, `EN_PROGRESO`, `RESUELTO`, `CERRADO` |
export enum TicketStatus {
    ABIERTO = 'ABIERTO',
    EN_PROGRESO = 'EN_PROGRESO',
    RESUELTO = 'RESUELTO',
    CERRADO = 'CERRADO'
}

export interface Iticket extends Document { //El document viene de mongoose hacemos extend para agregar todas sus propiedades y metodos internos
    title: string,
    description: string,
    status: TicketStatus,
    ownerId: Types.ObjectId,
}

const TicketSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: Object.values(TicketStatus),
            default: TicketStatus.ABIERTO
        },
        ownerId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        }
    },
    {
        timestamps: true   //crea los campos createAt y updateAt 
    }
);

export const Ticket = model<Iticket>( 'Ticket', TicketSchema )


