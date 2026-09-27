import { useCallback, useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import StatsBar from "./components/StatsBar";
import Toolbar from "./components/Toolbar";
import ProductTable from "./components/ProductTable";
import AddProductModal from "./components/AddProductModal";
import Users from "./components/Users";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";

import {
    getProducts,
    postProduct,
    putProduct,
    deleteProduct
} from "./services/axios";

const CATEGORIES = [
    "Electronics",
    "Clothing",
    "Books",
    "Shoes",
    "Bags",
    "Accessories",
    "Skincare"
];

function App() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isAdmin = user?.role === "admin";

    const [currentPage, setCurrentPage] = useState(
        isAdmin ? "dashboard" : "products"
    );

    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState(
        "All categories"
    );

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // =========================
    // CART
    // =========================

    const [cartItems, setCartItems] = useState([]);

    const [showCheckout, setShowCheckout] = useState(false);

    // Add product to cart
    const handleAddToCart = (product) => {
        setCartItems((prev) => [
            ...prev,
            {
                ...product,
                quantity: 1
            }
        ]);
    };

    const handleClearCart = () => {
    setCartItems([]);
    };

    // Remove product completely from cart
    const handleRemoveFromCart = (id) => {
        setCartItems((prev) =>
            prev.filter((item) => item._id !== id)
        );
    };

    // Increase quantity
    const handleIncreaseQuantity = (product) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item._id === product._id &&
                item.quantity < product.stock
                    ? {
                          ...item,
                          quantity: item.quantity + 1
                      }
                    : item
            )
        );
    };

    // Decrease quantity
    const handleDecreaseQuantity = (id) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item._id === id
                        ? {
                              ...item,
                              quantity: item.quantity - 1
                          }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };

    // Change quantity directly from Cart
    const handleQuantityChange = (id, quantity) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item._id === id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  quantity,
                                  item.stock
                              )
                          }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };

    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = useCallback(async () => {
        const response = await getProducts(
            query,
            category === "All categories"
                ? ""
                : category,
            page,
            4
        );

        return response.data;
    }, [page, query, category]);

    // Get products when page/search/category changes
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);

            try {
                const data = await fetchProducts();

                setProducts(data.products);
                setTotalPages(
                    data.pagination.totalPages
                );
            } catch (error) {
                console.error(
                    "Failed to fetch products:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [fetchProducts]);

    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Delete this product?"
            )
        ) {
            return;
        }

        try {
            await deleteProduct(id);

            const data = await fetchProducts();

            setProducts(data.products);
            setTotalPages(
                data.pagination.totalPages
            );
        } catch (error) {
            console.error(
                "Failed to delete product:",
                error
            );
        }
    };

    // =========================
    // EDIT PRODUCT
    // =========================

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleEditProduct = async (
        id,
        formData
    ) => {
        try {
            const response = await putProduct(
                id,
                formData
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id
                        ? response.data
                        : product
                )
            );

            setEditingProduct(null);
        } catch (error) {
            console.error(
                "Failed to update product:",
                error
            );

            throw error;
        }
    };

    // =========================
    // ADD PRODUCT
    // =========================

    const handleAddProduct = async (formData) => {
        try {
            await postProduct(formData);

            const data = await fetchProducts();

            setProducts(data.products);
            setTotalPages(
                data.pagination.totalPages
            );

            setShowModal(false);
        } catch (error) {
            console.error(
                "Failed to add product:",
                error
            );

            throw error;
        }
    };

    return (
    <div className="flex flex-col lg:flex-row">

        <Navbar 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />

        <div className="bg-[#f5f7f6] flex-1 min-h-screen py-4 px-3 sm:px-4 lg:py-5 lg:px-6">

                <Topbar />

                {/* =========================
                    DASHBOARD
                ========================= */}

                {currentPage === "dashboard" &&
                    isAdmin && (
                        <Dashboard />
                    )}

                {/* =========================
                    PRODUCTS
                ========================= */}

                {currentPage === "products" && (
                    <>
                        {isAdmin && (
                            <StatsBar
                                productCount={
                                    products.length
                                }
                                lowStockCount={products.filter(
                                    (product) =>
                                        product.stock >
                                            0 &&
                                        product.stock <=
                                            10
                                ).length}
                                categoryCount={
                                    new Set(
                                        products.map(
                                            (product) =>
                                                product.category
                                        )
                                    ).size
                                }
                            />
                        )}

                        <Toolbar
                            query={query}
                            onQueryChange={(value) => {
                                setQuery(value);
                                setPage(1);
                            }}
                            category={category}
                            onCategoryChange={(value) => {
                                setCategory(value);
                                setPage(1);
                            }}
                            categories={CATEGORIES}
                            onAddClick={
                                isAdmin
                                    ? () =>
                                          setShowModal(
                                              true
                                          )
                                    : undefined
                            }
                        />

                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <p className="text-gray-500">
                                    Loading products...
                                </p>
                            </div>
                        ) : products.length ===
                          0 ? (
                            <div className="flex flex-col items-center justify-center py-16">

                                <p className="text-lg font-medium text-gray-700">
                                    No products found
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Try changing your
                                    search or category
                                    filter.
                                </p>

                            </div>
                        ) : (
                            <ProductTable
                                products={products}

                                onEdit={
                                    isAdmin
                                        ? handleEdit
                                        : undefined
                                }

                                onDelete={
                                    isAdmin
                                        ? handleDelete
                                        : undefined
                                }

                                onAddToCart={
                                    !isAdmin
                                        ? handleAddToCart
                                        : undefined
                                }

                                onRemoveFromCart={
                                    !isAdmin
                                        ? handleRemoveFromCart
                                        : undefined
                                }

                                onIncreaseQuantity={
                                    !isAdmin
                                        ? handleIncreaseQuantity
                                        : undefined
                                }

                                onDecreaseQuantity={
                                    !isAdmin
                                        ? handleDecreaseQuantity
                                        : undefined
                                }

                                cartItems={cartItems}
                            />
                        )}

                        {/* Pagination */}

                        <div className="flex items-center justify-center gap-4 mt-6">

                            <button
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                                disabled={page === 1}
                                className="px-4 py-2 bg-[#1f6f6b] border border-gray-300 rounded-lg disabled:bg-gray-300"
                            >
                                Previous
                            </button>

                            <span className="text-gray-600">
                                Page {page} of{" "}
                                {totalPages}
                            </span>

                            <button
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                                disabled={
                                    page ===
                                    totalPages
                                }
                                className="px-4 py-2 bg-[#1f6f6b] border border-gray-300 rounded-lg disabled:bg-gray-300"
                            >
                                Next
                            </button>

                        </div>
                    </>
                )}

                {/* =========================
                    CART
                ========================= */}

                {currentPage === "cart" &&
                    !isAdmin && (
                        <Cart
                            cartItems={cartItems}
                            onRemove={
                                handleRemoveFromCart
                            }
                            onQuantityChange={
                                handleQuantityChange
                            }
                            onCheckout={() => setShowCheckout(true)}
                        />
                    )}

                {/* =========================
                    USERS
                ========================= */}

                {currentPage === "users" &&
                    isAdmin && <Users />}

                {/* =========================
                    SETTINGS
                ========================= */}

                {currentPage === "settings" && (
                    <Settings />
                )}

            </div>

            {/* =========================
                ADD PRODUCT MODAL
            ========================= */}

            {isAdmin && showModal && (
                <AddProductModal
                    categories={CATEGORIES}
                    onAdd={handleAddProduct}
                    onClose={() =>
                        setShowModal(false)
                    }
                />
            )}
            

            {/* =========================
                EDIT PRODUCT MODAL
            ========================= */}

                                    {isAdmin && editingProduct && (
                <AddProductModal
                    categories={CATEGORIES}
                    initialProduct={editingProduct}
                    onAdd={handleEditProduct}
                    onClose={() =>
                        setEditingProduct(null)
                    }
                />
            )}

            {showCheckout && (
                <CheckoutModal
                    cartItems={cartItems}
                    onClose={() => setShowCheckout(false)}
                    onClearCart={handleClearCart}
                />
            )}

        </div>
    );
}

export default App;