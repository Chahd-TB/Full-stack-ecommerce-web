import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000"
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getProducts = (
    search = "",
    category = "",
    page = 1,
    limit = 4
) => {
    return API.get("/products", {
        params: {
            search,
            page,
            limit,
            ...(category !== "" && {
                category
            })
        }
    });
};

export const getProduct = (id) =>
    API.get(`/products/${id}`);

export const postProduct = (formData) =>
    API.post("/products", formData);

export const putProduct = (id, formData) =>
    API.put(`/products/${id}`, formData);

export const deleteProduct = (id) =>
    API.delete(`/products/${id}`);

export const loginUser = (user) =>
    API.post("/auth/login", user);

export const signupUser = (user) =>
    API.post("/auth/signup", user);

export const getUsers = () =>
    API.get("/auth/users");

export const makeAdmin = (email) =>
    API.patch("/auth/make-admin", { email });

export const makeUser = (email) =>
    API.patch("/auth/make-user", { email });

export const getDashboardStats = () =>
    API.get("/dashboard/stats");

export const updateProfile = (data) =>
    API.put("/auth/profile", data);

export const updatePassword = (data) =>
    API.put("/auth/profile", data);

export const postOrder = (orderData) =>
    API.post("/orders", orderData);

export const postPayment = (orderId) =>  
    API.post("/payments", {
        orderId
    });

export const processPayment = (paymentId, cardNumber) =>
    API.post("/payments/process", {
        paymentId,
        cardNumber
    });