import { Input } from '@/components/ui/input';
import { useChatStore } from '@/hooks/useChatStore';
import { Search } from 'lucide-react';
import React, { useState } from 'react'

const SidebarInput = () => {
  // Subscribe only to the `searchValue`
  const setSearchValue = useChatStore((state) => state.setSearchValue);

 
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        placeholder="Search conversations, users or messages"
        className="pl-9 pr-4 py-2 "
      />
    </div>
  );
}

export default SidebarInput