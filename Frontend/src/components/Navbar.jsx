import { useState } from "react";

function Navbar({ currentPage, onPageChange }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    const [active, setActive] = useState(
    currentPage === "users"
        ? "Users"
        : currentPage === "settings"
        ? "Settings"
        : currentPage === "cart"
        ? "Cart"
        : currentPage === "products"
        ? "Products"
        : isAdmin
        ? "Dashboard"
        : "Products"
);

    const handleNavigation = (item) => {
    setActive(item);

    if (item === "Products") {
        onPageChange("products");
    }

    if (item === "Users") {
        onPageChange("users");
    }

    if (item === "Dashboard") {
        onPageChange("dashboard");
    }

    if (item === "Settings") {
        onPageChange("settings");
    }
    
    if (item === "Cart") {
        onPageChange("cart");
    }
};

    return (
        <div className="h-screen w-64 p-5 py-10">
            <h2 className="text-3xl font-bold mb-12">
                Productly
            </h2>

            <ul className="text-lg text-gray-600">
                {[
                    ...(isAdmin ? ["Dashboard"] : []),
                    "Products",
                    ...(!isAdmin ? ["Cart"] : []),
                    ...(isAdmin ? ["Users"] : []),
                    "Settings"
                ].map((item) => (
                    <li
                        key={item}
                        onClick={() => handleNavigation(item)}
                        className={`py-3 px-4 my-2 border-l-4 cursor-pointer hover:text-black ${
                            active === item
                                ? "border-[#1f6f6b] text-black"
                                : "border-transparent"
                        }`}
                    >
                        <a
                            href="#"
                            onClick={(e) =>
                                e.preventDefault()
                            }
                        >
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Navbar;