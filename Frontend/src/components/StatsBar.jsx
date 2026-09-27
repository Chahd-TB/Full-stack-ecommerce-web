import StatCard from "./StatCard";

function StatsBar({
    productCount,
    lowStockCount,
    categoryCount
}) {
    return (
        <div className="flex gap-4 px-4 mb-3">

            <StatCard
                value={productCount}
                label="Products"
            />

            <StatCard
                value={lowStockCount}
                label="Low stock"
                variant="warning"
            />

            <StatCard
                value={categoryCount}
                label="Categories"
                variant="purple"
            />

        </div>
    );
}

export default StatsBar;