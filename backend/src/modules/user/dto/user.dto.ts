//creacion
export interface createUserDTO {
  name: string;
  email: string;
  password: string;
  rol?: string;
}

//respuesta con usuario seguro
export interface userResponseDTO{
  _id: string,
  name: string,
  email: string,
  rol: string
}