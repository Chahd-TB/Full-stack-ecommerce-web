function Topbar({ currentPage }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const pageInfo = {
        dashboard: {
            title: "Dashboard",
            description: "Overview of your store and inventory"
        },
        products: {
            title: "Products",
            description: "Manage your products and inventory"
        },
        users: {
            title: "Users",
            description: "Manage users and permissions"
        },
        settings: {
            title: "Settings",
            description: "Manage your account and application settings"
        }
    };

    const currentPageInfo =
        pageInfo[currentPage] || pageInfo.products;

    return (
    <div className="mx-2 sm:mx-4 mt-2 mb-4 rounded-2xl bg-[#e5f2f0] px-4 sm:px-7 py-4 sm:py-6 flex items-center justify-between gap-3">

        {/* Page information */}
        <div className="min-w-0">
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#173b39]">
                {currentPageInfo.title}
            </h2>

            <p className="text-[#52706e] text-sm sm:text-lg mt-1 truncate">
                {currentPageInfo.description}
            </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            <div className="text-right hidden sm:block">
                <p className="font-semibold text-[#173b39]">
                    {user?.name}
                </p>

                <p className="text-sm text-[#66817e]">
                    {user?.role}
                </p>
            </div>

            <img
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Profile"
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md"
            />

        </div>

    </div>
);
}

export default Topbar;