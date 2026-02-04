import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const { t, i18n } = useTranslation();

  // Llama a onSearch cada vez que cambia el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex justify-center items-center w-full mb-6 mt-6 m-6">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder={t("buscar")}
          value={query}
          onChange={handleChange}
          className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2 rounded-full w-full shadow-sm transition-all duration-200 text-lg bg-white placeholder-gray-400 text-[#111]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
      </div>
    </div>
  );
}
