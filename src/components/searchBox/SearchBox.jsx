import React from 'react';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchBox() {
  return (
    <div className="flex-grow w-[200px] ">
      <div className="relative w-[200px] sm:w-auto sm:ml-2 rounded">
        <label htmlFor='search' className="absolute inset-y-0 left-0 flex items-center pl-2 cursor-pointer">
          <SearchIcon />
        </label>
        <input
          type="text"
          placeholder="Search…"
          aria-label="search"
          id='search'
          className="w-[200px] pl-10 pr-2 py-1 size-10 bg-opacity-15 rounded outline-none hover:bg-slate-200"
        />
      </div>
    </div>
  );
}
