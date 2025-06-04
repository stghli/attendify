
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar: React.FC = () => {
  return (
    <div className="hidden md:flex items-center border rounded-full bg-white/60 backdrop-blur-sm px-3 py-1.5 max-w-xs shadow-sm hover:shadow-md transition-shadow">
      <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
      <Input 
        type="search" 
        placeholder="Search..." 
        className="h-5 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs placeholder:text-gray-400"
      />
    </div>
  );
};

export default SearchBar;
