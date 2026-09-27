function Toolbar({
    query,
    onQueryChange,
    category,
    onCategoryChange,
    categories,
    onAddClick
}) {
    return (
        <div className="mx-4 mb-4 rounded-2xl py-4 flex items-center gap-3">

            <input
                value={query}
                onChange={(e) =>
                    onQueryChange(e.target.value)
                }
                placeholder="Search products..."
                className="bg-white border border-gray-200 px-4 py-2.5 text-base rounded-xl w-64 outline-none focus:border-[#1f6f6b]"
            />

            <select
                value={category}
                onChange={(e) =>
                    onCategoryChange(e.target.value)
                }
                className="bg-white border border-gray-200 px-4 py-2.5 text-base rounded-xl outline-none focus:border-[#1f6f6b]"
            >
                <option value="All categories">
                    All categories
                </option>

                {categories.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>

            {onAddClick && (
                <button
                    onClick={onAddClick}
                    className="ml-auto bg-[#1f6f6b] hover:bg-[#185b58] text-white px-5 py-2.5 rounded-xl text-base font-medium shadow-sm transition"
                >
                    + Add Product
                </button>
            )}

        </div>
    );
}

export default Toolbar;