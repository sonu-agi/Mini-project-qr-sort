import React from 'react';
import { FilterOptions, SortOption } from '../types';
import { DEPARTMENTS, YEARS, SECTIONS } from '../constants';

interface FilterControlsProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, sortOption, setSortOption }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const FilterSelect: React.FC<{name: keyof FilterOptions, label: string, options: string[]}> = ({name, label, options}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
          id={name}
          name={name}
          value={filters[name]}
          onChange={handleFilterChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white text-gray-800"
        >
          <option value="all">All</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FilterSelect name="year" label="Year" options={YEARS} />
        <FilterSelect name="department" label="Department" options={DEPARTMENTS} />
        <FilterSelect name="section" label="Section" options={SECTIONS} />
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            id="sort"
            name="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white text-gray-800"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;