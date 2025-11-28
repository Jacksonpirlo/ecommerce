import mongoose, { Schema, Document } from "mongoose";

export interface ICartProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  products: ICartProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const CartProductSchema = new Schema<ICartProduct>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
});

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  products: [CartProductSchema],
}, { timestamps: true });

export const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);