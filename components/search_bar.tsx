"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { MemberProfile } from "@/utils/utils";
import MemberCard from "./member_card";

interface SearchProps {
    members: MemberProfile[], 
    onSearchResults: (results: MemberProfile[]) => void 
}

export function MemberSearch({ members, onSearchResults }: SearchProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filteredMembers = search.trim() === "" ? [] : members.filter((member) => {
          const searchableFields = [
            member.name,
            member.email,
            member.major,
            member.graduation_date,
            member.about,
            member.phone,
            ...(member.club_roles || [])
          ];
          
          return searchableFields.some(field => 
            String(field).toLowerCase().includes(search.toLowerCase())
          );
        });
    
    onSearchResults(filteredMembers);
  }, [search]);

  return (
    <div className="flex w-full justify-center mt-10 mb-8">
        <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={15} />
            <Input
                className="pl-10"
                placeholder="Search for a member"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    </div>
  );
}

export function SearchResults({ filteredMembers, isSearching } : { members: MemberProfile[], filteredMembers: MemberProfile[], isSearching: boolean }) {
    if (!isSearching) return null;
    
    return (
      <div className="w-11/12 mb-8">
        {filteredMembers.length > 0 ? 
            <>
                <h2 className="text-xl font-bold mb-4">Search Results ({filteredMembers.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 mt-4">
                    {filteredMembers.map((member) => (
                        <MemberCard
                            key={member.name}
                            editable={false}
                            member_data={member}
                        />
                    ))}
                </div>
            </> : <></>}
      </div>
    );
  }

export function MemberSearchInput({ members }: { members: MemberProfile[] }) {
    const [filteredMembers, setFilteredMembers] = useState<MemberProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState("");
    
    const handleSearchResults = (results: MemberProfile[]) => {
        setFilteredMembers(results);
        setIsSearching(results.length > 0 || (results.length === 0 && results !== members));
    };

    useEffect(() => {
        const filteredMembers = search.trim() === "" ? [] 
          : members.filter((member) => {
              const searchableFields = [
                member.name,
                member.email,
                member.major,
                member.graduation_date,
                member.about,
                member.phone,
                ...(member.club_roles || [])
              ].filter(Boolean);
              
              return searchableFields.some(field => 
                String(field).toLowerCase().includes(search.toLowerCase())
              );
            });
        
        handleSearchResults(filteredMembers);
      }, [search]);
    
    return (
        <>
            <div className="flex w-full justify-center mt-10 mb-2">
                <div className="relative md:w-1/3 w-2/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={15} />
                    <Input
                        className="pl-10"
                        placeholder="Search for a member"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <SearchResults 
                members={members} 
                filteredMembers={filteredMembers} 
                isSearching={isSearching} 
            />
        </>
    );
  }