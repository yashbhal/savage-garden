import { FC, useState, useEffect, ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search plants...',
  className = '',
  initialValue = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    // Reset search query if initialValue changes externally
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // Debounce search to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      onSearch(newQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        className="w-full block pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                  placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                  focus:ring-primary focus:border-primary sm:text-sm"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar; 