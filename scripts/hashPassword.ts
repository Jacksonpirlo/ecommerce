
// NOS SIRVE PARA HASHEAR LA CONTRASEÑA DE UN USUARIO POR AHORA
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const hashPassword = async () => {
  try {
    // Hashear la contraseña
    const password = "12345";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log("Contraseña original:", password);
    console.log("Contraseña hasheada:", hashedPassword);
    
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI no está definido");
    }
    
    await mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
    
    // Actualizar el usuario
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("No se pudo conectar a la base de datos");
    }
    
    const result = await db.collection("users").updateOne(
      { email: "jackson@gmail.com" },
      { $set: { password: hashedPassword } }
    );
    
    if (result.modifiedCount > 0) {
      console.log("Usuario actualizado correctamente");
    } else {
      console.log("No se encontró el usuario o ya tenía esa contraseña");
    }
    
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
    
  } catch (error) {
    console.error("Error:", error);
  }
};

hashPassword();
