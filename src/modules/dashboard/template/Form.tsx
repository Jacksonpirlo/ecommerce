"use client"
import React, { useEffect, useState } from "react"
import Label from "@/modules/auth/components/atoms/Label"
import { toast } from "react-toastify"
import { ProductFormData } from "@/dto/ProductProps"
import Form from "@/modules/auth/components/organisms/form"

const ProductForm = () => {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: ""
    })

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (!selectedFile) {
            setFile(null)
            setPreviewUrl("")
            return
        }
        if (!selectedFile.type.startsWith('image/')) {
            toast.error("Por favor selecciona una imagen válida")
            return
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("La imagen no debe superar los 5MB")
            return
        }
        const url = URL.createObjectURL(selectedFile)
        setFile(selectedFile)
        setPreviewUrl(url)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        // Validaciones
        if (!formData.name || !formData.price || !formData.description || !file) {
            toast.error("Por favor completa todos los campos obligatorios")
            return
        }
        if (parseFloat(formData.price) <= 0) {
            toast.error("El precio debe ser mayor a 0")
            return
        }
        setLoading(true)
        try {
            const data = new FormData()
            data.append("file", file)
            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("description", formData.description)
            data.append("stock", formData.stock)
            data.append("category", formData.category)
            const response = await fetch("/api/dashboard/products", {
                method: "POST",
                body: data,
            })
            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message || "Error al crear el producto")
            }
            toast.success("Producto creado exitosamente")
            setFormData({
                name: "",
                price: "",
                description: "",
                stock: "",
                category: ""
            })
            setFile(null)
            setPreviewUrl("")
        } catch (error: any) {
            console.error("Error al crear producto:", error)
            toast.error(error.message || "Error al crear el producto")
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        {
            placeHolder: "Nombre del Producto *",
            value: formData.name,
            type: "text",
            onChange: handleInputChange,
        },
        {
            placeHolder: "Precio *",
            value: formData.price,
            type: "number",
            onChange: handleInputChange,
        },
        {
            placeHolder: "Descripción *",
            value: formData.description,
            type: "text",
            onChange: handleInputChange,
        },
        {
            placeHolder: "Stock Disponible",
            value: formData.stock,
            type: "number",
            onChange: handleInputChange,
        },
        {
            placeHolder: "Categoría",
            value: formData.category,
            type: "text",
            onChange: handleInputChange,
        },
    ]

    return (
        <section className="max-w-2xl mx-auto p-6 m-20">
            <Form
                fields={fields}
                titleOfTheForm="Crear Nuevo Producto"
                onClick={handleSubmit}
                btnText={loading ? "Creando producto..." : "Crear Producto"}
                btnDisabled={loading}
                className="bg-white p-8 rounded-lg shadow-md" placeholder={""} value={""}            />
            {/* Imagen */}
            <div className="mt-6">
                <Label text="Imagen del Producto *" className="text-gray-700 font-semibold mb-2" />
                <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                    required
                />
                {previewUrl && (
                    <div className="mt-4">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full h-64 object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductForm