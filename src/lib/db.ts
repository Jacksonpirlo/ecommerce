import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI no está definido en las variables de entorno.");
    }
    await mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB correctamente ");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al conectar con MongoDB:", error.message);
    } else {
      console.error("Error al conectar con MongoDB:", error);
    }
    process.exit(1);
  }
};