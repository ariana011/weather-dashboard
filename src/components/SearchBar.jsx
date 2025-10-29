export default function SearchBar({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="🔍 Search city..."
            className="search-bar"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

