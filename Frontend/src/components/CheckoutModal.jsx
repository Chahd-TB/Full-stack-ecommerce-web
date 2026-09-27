import { useState } from "react";
import {
    postOrder,
    postPayment,
    processPayment
} from "../services/axios";

const WILAYAS = ["Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida",
    "Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Algiers","Djelfa","Jijel","Sétif",
    "Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara",
    "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane"
];

const CheckoutModal = ({
    onClose,
    cartItems,
    onClearCart
}) => {
    const [step, setStep] = useState(1);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [wilaya, setWilaya] = useState("");
    const [address, setAddress] = useState("");

    const [paymentMethod, setPaymentMethod] = useState(
        "cash_on_delivery"
    );

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    // =========================
    // CREATE ORDER
    // =========================

    const handleCreateOrder = async () => {
        try {
            setLoading(true);
            setServerError("");

            const products = cartItems.map((item) => ({
                product: item._id,
                quantity: item.quantity
            }));

            const orderData = {
                products,
                totalPrice,

                customerInfo: {
                    fullName,
                    phone,
                    wilaya,
                    address
                },

                paymentMethod
            };

            const orderResponse =
                await postOrder(orderData);

            console.log(
                "Order created:",
                orderResponse.data
            );

            // COD does not need a Payment document
            onClearCart();

            setSuccess(true);

        } catch (error) {
            console.error(
                "Failed to create order:",
                error
            );

            setServerError(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to place your order. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // STEP 1
    // CUSTOMER + PAYMENT METHOD
    // =========================

    const handleContinue = () => {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName =
                "Full name is required";
        }

        if (!phone.trim()) {
            newErrors.phone =
                "Phone number is required";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone =
                "Phone number must contain 10 digits";
        }

        if (!wilaya) {
            newErrors.wilaya =
                "Please select your wilaya";
        }

        if (!address.trim()) {
            newErrors.address =
                "Address is required";
        }

        if (!paymentMethod) {
            newErrors.paymentMethod =
                "Please select a payment method";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setServerError("");

        // COD → directly create order
        if (paymentMethod === "cash_on_delivery") {
            handleCreateOrder();
            return;
        }

        // CIB / Edahabia → go to payment step
        setStep(2);
    };

    // =========================
    // CARD NUMBER FORMAT
    // =========================

    const handleCardNumberChange = (e) => {
        let value = e.target.value;

        // Keep only numbers
        value = value.replace(/\D/g, "");

        // Maximum 16 digits
        value = value.slice(0, 16);

        // Add space every 4 digits
        value = value.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
        );

        setCardNumber(value);
    };

    // =========================
    // EXPIRY DATE FORMAT
    // =========================

    const handleExpiryChange = (e) => {
        let value = e.target.value;

        // Keep only numbers
        value = value.replace(/\D/g, "");

        // Maximum 4 digits
        value = value.slice(0, 4);

        // Add /
        if (value.length >= 3) {
            value =
                value.slice(0, 2) +
                "/" +
                value.slice(2);
        }

        setExpiryDate(value);
    };

    // =========================
    // PAYMENT
    // =========================

    const handlePay = async () => {
        const newErrors = {};

        if (!cardName.trim()) {
            newErrors.cardName =
                "Cardholder name is required";
        }

        const cleanCardNumber =
            cardNumber.replace(/\s/g, "");

        if (!cleanCardNumber) {
            newErrors.cardNumber =
                "Card number is required";
        } else if (cleanCardNumber.length !== 16) {
            newErrors.cardNumber =
                "Card number must contain 16 digits";
        }

        if (!expiryDate) {
            newErrors.expiryDate =
                "Expiry date is required";
        } else if (
            !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
                expiryDate
            )
        ) {
            newErrors.expiryDate =
                "Use MM/YY format";
        }

        if (!cvv) {
            newErrors.cvv =
                "CVV is required";
        } else if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv =
                "CVV must contain 3 digits";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // =========================
        // TEST PAYMENT
        // =========================

        if (
            cleanCardNumber !==
            "4242424242424242"
        ) {
            setServerError(
                "Test payment failed. Use the test card: 4242 4242 4242 4242"
            );

            return;
        }

        if (expiryDate !== "12/30") {
            setServerError(
                "Test payment failed. Use expiry date: 12/30"
            );

            return;
        }

        if (cvv !== "123") {
            setServerError(
                "Test payment failed. Use CVV: 123"
            );

            return;
        }

        // =========================
        // CREATE ORDER
        // =========================

        try {
            setLoading(true);
            setServerError("");

            const products = cartItems.map((item) => ({
                product: item._id,
                quantity: item.quantity
            }));

            const orderData = {
                products,
                totalPrice,

                customerInfo: {
                    fullName,
                    phone,
                    wilaya,
                    address
                },

                paymentMethod
            };

            // 1. Create Order
            const orderResponse =
                await postOrder(orderData);

            console.log(
                "Order created:",
                orderResponse.data
            );

            // Get the created Order ID
            const orderId =
                orderResponse.data._id;

            // =========================
            // CREATE PAYMENT
            // =========================

            // 2. Create Payment
            const paymentResponse =
                await postPayment(orderId);

            console.log(
                "Payment created:",
                paymentResponse.data
            );

            const paymentId =
                paymentResponse.data._id;

            const cleanCardNumber =
                cardNumber.replace(/\s/g, "");

            const processedPayment =
                await processPayment(
                    paymentId,
                    cleanCardNumber
                );

            console.log(
                "Payment processed:",
                processedPayment.data
            );

            onClearCart();

            setSuccess(true);

        } catch (error) {
            console.error(
                "Payment failed:",
                error
            );

            setServerError(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Payment failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // SUCCESS SCREEN
    // =========================

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">

                    <div className="text-5xl mb-4">
                        ✓
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                        Order Successful!
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-black text-white py-3 rounded-xl"
                    >
                        Done
                    </button>

                </div>
            </div>
        );
    }

    // =========================
    // MAIN MODAL
    // =========================

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Checkout
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Step {step} of 2
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 text-xl"
                    >
                        ✕
                    </button>

                </div>

                {/* SERVER ERROR */}

                {serverError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {serverError}
                    </div>
                )}

                {/* =========================
                    STEP 1
                ========================= */}

                {step === 1 && (
                    <div className="space-y-4">

                        {/* FULL NAME */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter your full name"
                            />

                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* PHONE */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10)
                                    )
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="05XXXXXXXX"
                            />

                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* WILAYA */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Wilaya
                            </label>

                            <select
                                value={wilaya}
                                onChange={(e) =>
                                    setWilaya(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="">
                                    Select your wilaya
                                </option>

                                {WILAYAS.map(
                                    (wilayaName) => (
                                        <option
                                            key={
                                                wilayaName
                                            }
                                            value={
                                                wilayaName
                                            }
                                        >
                                            {
                                                wilayaName
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.wilaya && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.wilaya}
                                </p>
                            )}
                        </div>

                        {/* ADDRESS */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Address
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter your delivery address"
                                rows="3"
                            />

                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* PAYMENT METHOD */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Payment Method
                            </label>

                            <div className="space-y-3">

                                {/* COD */}

                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">

                                    <input
                                        type="radio"
                                        value="cash_on_delivery"
                                        checked={
                                            paymentMethod ===
                                            "cash_on_delivery"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div>
                                        <p className="font-medium">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>
                                    </div>

                                </label>

                                {/* CIB */}

                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">

                                    <input
                                        type="radio"
                                        value="cib_edahabia"
                                        checked={
                                            paymentMethod ===
                                            "cib_edahabia"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div>
                                        <p className="font-medium">
                                            CIB / Edahabia
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay securely by card
                                        </p>
                                    </div>

                                </label>

                            </div>

                            {errors.paymentMethod && (
                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.paymentMethod
                                    }
                                </p>
                            )}
                        </div>

                        {/* TOTAL */}

                        <div className="border-t pt-4 flex justify-between text-lg font-bold">
                            <span>
                                Total
                            </span>

                            <span>
                                {totalPrice} DA
                            </span>
                        </div>

                        {/* CONTINUE */}

                        <button
                            onClick={
                                handleContinue
                            }
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
                        >
                            {loading
                                ? "Processing..."
                                : paymentMethod ===
                                  "cash_on_delivery"
                                ? "Place Order"
                                : "Continue to Payment"}
                        </button>

                    </div>
                )}

                {/* =========================
                    STEP 2
                ========================= */}

                {step === 2 && (
                    <div className="space-y-4">

                        <div className="bg-gray-100 rounded-xl p-4">
                            <p className="font-medium">
                                Test Payment
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                                Card:
                                {" "}
                                4242 4242 4242 4242
                            </p>

                            <p className="text-sm text-gray-600">
                                Expiry:
                                {" "}
                                12/30
                            </p>

                            <p className="text-sm text-gray-600">
                                CVV:
                                {" "}
                                123
                            </p>
                        </div>

                        {/* CARD NAME */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Cardholder Name
                            </label>

                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) =>
                                    setCardName(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="Name on card"
                            />

                            {errors.cardName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.cardName}
                                </p>
                            )}
                        </div>

                        {/* CARD NUMBER */}

                        <div>
                            <label className="block mb-1 font-medium">
                                Card Number
                            </label>

                            <input
                                type="text"
                                value={cardNumber}
                                onChange={
                                    handleCardNumberChange
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="4242 4242 4242 4242"
                            />

                            {errors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.cardNumber
                                    }
                                </p>
                            )}
                        </div>

                        {/* EXPIRY + CVV */}

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block mb-1 font-medium">
                                    Expiry Date
                                </label>

                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={
                                        handleExpiryChange
                                    }
                                    className="w-full border rounded-lg p-3"
                                    placeholder="12/30"
                                />

                                {errors.expiryDate && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {
                                            errors.expiryDate
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    CVV
                                </label>

                                <input
                                    type="password"
                                    value={cvv}
                                    onChange={(e) =>
                                        setCvv(
                                            e.target.value
                                                .replace(
                                                    /\D/g,
                                                    ""
                                                )
                                                .slice(
                                                    0,
                                                    3
                                                )
                                        )
                                    }
                                    className="w-full border rounded-lg p-3"
                                    placeholder="123"
                                />

                                {errors.cvv && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.cvv}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* TOTAL */}

                        <div className="border-t pt-4 flex justify-between text-lg font-bold">
                            <span>
                                Total
                            </span>

                            <span>
                                {totalPrice} DA
                            </span>
                        </div>

                        {/* BUTTONS */}

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    setStep(1)
                                }
                                disabled={loading}
                                className="w-1/3 border py-3 rounded-xl"
                            >
                                Back
                            </button>

                            <button
                                onClick={handlePay}
                                disabled={loading}
                                className="w-2/3 bg-black text-white py-3 rounded-xl disabled:opacity-50"
                            >
                                {loading
                                    ? "Processing..."
                                    : `Pay ${totalPrice} DA`}
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckoutModal;