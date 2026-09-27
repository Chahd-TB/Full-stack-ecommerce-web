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

    const menuItems = [
        ...(isAdmin ? ["Dashboard"] : []),
        "Products",
        ...(!isAdmin ? ["Cart"] : []),
        ...(isAdmin ? ["Users"] : []),
        "Settings"
    ];

    return (
        <div className="w-full lg:w-64 lg:h-screen lg:shrink-0 p-4 lg:p-5 lg:py-10">

            {/* Logo */}
            <h2 className="text-3xl font-bold mb-4 lg:mb-12">
                Productly
            </h2>

            {/* Navigation */}
            <ul className="flex gap-2 overflow-x-auto lg:block text-base lg:text-lg text-gray-600">

                {menuItems.map((item) => (
                    <li
                        key={item}
                        onClick={() => handleNavigation(item)}
                        className={`
                            shrink-0
                            py-2 px-4
                            lg:py-3 lg:px-4 lg:my-2
                            border-b-4 lg:border-b-0 lg:border-l-4
                            cursor-pointer
                            hover:text-black
                            ${
                                active === item
                                    ? "border-[#1f6f6b] text-black"
                                    : "border-transparent"
                            }
                        `}
                    >
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
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