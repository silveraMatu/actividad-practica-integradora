// database.ts
import mongoose, { type ConnectOptions, Mongoose } from 'mongoose';

//singleton para la base de datos
export class Database {
  private static instance: Database;
  private connection: Mongoose | null = null;
  private connectionPromise: Promise<Mongoose> | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string, options: ConnectOptions = {}): Promise<Mongoose> {
    //si ya esta conectado
    if (this.connection && mongoose.connection.readyState === 1) {
      return this.connection;
    }

    // evitar race condition
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = mongoose.connect(uri, options)
      .then((conn) => {
        this.connection = conn;
        console.log('MongoDB conectado exitosamente');
        return this.connection;
      })
      .catch((err) => {
        this.connectionPromise = null; //permite reintentar si falla
        console.error('Error al conectar a MongoDB:', err);
        throw err;
      });

    return this.connectionPromise;
  }

  public async disconnect() {
    try {
    await this.connection?.disconnect()
    console.log("Desconectado de la base de datos.")
    } catch(err) {
      console.log("Error al desconectar la base de datos", err)
      throw err
    } finally {
      this.connection = null
      this.connectionPromise = null
    }
  }
}

export const db = Database.getInstance();