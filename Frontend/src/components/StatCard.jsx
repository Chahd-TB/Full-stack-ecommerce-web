function StatCard({ value, label, variant = "default" }) {
    const styles = {
        default: "bg-[#dff0ed] text-[#185b58]",
        warning: "bg-[#fff0d6] text-[#a76500]",
        danger: "bg-[#fce4e4] text-[#b42318]",
        purple: "bg-[#e8e4f4] text-[#5c4c87]"
    };

    return (
        <div
            className={`rounded-2xl px-6 py-6 flex-1 ${styles[variant]}`}
        >
            <p className="text-3xl font-semibold">
                {value}
            </p>

            <p className="text-sm mt-2 opacity-75">
                {label}
            </p>
        </div>
    );
}

export default StatCard;