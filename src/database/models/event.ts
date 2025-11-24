import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título es requerido"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "La categoría es requerida"],
    trim: true,
  },
  img: {
    type: String,
    required: [true, "La imagen es requerida"],
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

export const Events = mongoose.models.Events || mongoose.model("Events", eventSchema);
