import React from 'react';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchBox() {
  return (
    <div className="flex-grow">
      <div className="relative w-full sm:w-auto sm:ml-2 hover:bg-slate-200 rounded">
        <label htmlFor='search' className="absolute inset-y-0 left-0 flex items-center pl-2 cursor-pointer">
          <SearchIcon />
        </label>
        <input
          type="text"
          placeholder="Search…"
          aria-label="search"
          id='search'
          className="w-full pl-10 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none "
        />
      </div>
    </div>
  );
}
