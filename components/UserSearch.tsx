import { Doc } from "@/convex/_generated/dataModel";
import { useUserSearch } from "@/hooks/useUserSearch";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";

interface UserSearchProps {
  onSelectUser: (user: Doc<"users">) => void;
  placeholder?: string;
  className?: string;
}

const UserSearch = ({
  onSelectUser,
  placeholder,
  className,
}: UserSearchProps) => {
  const { searchTerm, setSearchTerm, clearSearch, searchResults, isLoading } =
    useUserSearch();

  const { user } = useUser();

  const filteredResults = searchResults.filter(
    (searchUser) => searchUser._id !== user?.id
  );

  const handleSelectUser = (user: (typeof filteredResults)[0]) => {
    onSelectUser?.(user);
    setSearchTerm("");
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base pl-10 pr-10 h-12"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </Search>
      </div>
    </div>
  );
};

export default UserSearch;
