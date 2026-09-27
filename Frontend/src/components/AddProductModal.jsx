import { useState } from "react";

function AddProductModal({
    categories,
    onAdd,
    onClose,
    initialProduct = null
}) {
    const isEditing = Boolean(initialProduct);

    const [name, setName] = useState(
        initialProduct?.name || ""
    );

    const [category, setCategory] = useState(
        initialProduct?.category ||
        categories.find((c) => c !== "All categories")
    );

    const [price, setPrice] = useState(
        initialProduct?.price?.toString() || ""
    );

    const [stock, setStock] = useState(
        initialProduct?.stock?.toString() || ""
    );

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim() || price === "" || stock === "") {
        setError("Please fill in all fields.");
        return;
    }

    try {
        setLoading(true);

        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("category", category);
        formData.append("price", price);
        formData.append("stock", stock);

        if (image) {
            formData.append("image", image);
        }

        if (isEditing) {
            await onAdd(
                initialProduct._id,
                formData
            );
        } else {
            await onAdd(formData);
        }

        onClose();

    } catch (error) {
        console.error(
            "Failed to save product:",
            error
        );

        setError(
            error.response?.data?.error ||
            "Failed to save product. Check that the backend is running."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96">

                <h3 className="text-xl font-semibold mb-4">
                    {isEditing
                        ? "Edit product"
                        : "Add product"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                >

                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-600">
                            Product name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. AirPods Pro"
                            className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm text-gray-600">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
                        >
                            {categories
                                .filter(
                                    (c) =>
                                        c !== "All categories"
                                )
                                .map((c) => (
                                    <option
                                        key={c}
                                        value={c}
                                    >
                                        {c}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Price + Stock */}
                    <div className="flex gap-3">

                        <div className="flex-1">
                            <label className="text-sm text-gray-600">
                                Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                                placeholder="0"
                                className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-sm text-gray-600">
                                Stock
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) =>
                                    setStock(e.target.value)
                                }
                                placeholder="0"
                                className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
                            />
                        </div>

                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm text-gray-600">
                            Product image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                            className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {loading
                                ? isEditing
                                    ? "Saving..."
                                    : "Adding..."
                                : isEditing
                                ? "Save changes"
                                : "Add product"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddProductModal;