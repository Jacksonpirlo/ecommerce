import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
        trim: true,
    },
    type: {
        type: String,
        default: "Sin categoría",
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "El precio es requerido"],
        min: [0, "El precio debe ser mayor o igual a 0"],
    },
    image: {
        type: String,
        required: [true, "La imagen es requerida"],
    },
    description: {
        type: String,
        required: [true, "La descripción es requerida"],
        trim: true,
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "El stock no puede ser negativo"],
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
