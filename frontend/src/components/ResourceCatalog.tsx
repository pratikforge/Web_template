import React, { useState, useMemo } from 'react';
import { Search, Filter, Radio, RotateCcw, SearchX } from 'lucide-react';
import type { CampusResource, ResourceCategory } from '../types/campus';
import { ResourceCard } from './ResourceCard';

interface ResourceCatalogProps {
  resources: CampusResource[];
  onSelectResource: (resource: CampusResource) => void;
  onOpenBeaconDrawer: () => void;
}

const CATEGORIES: ResourceCategory[] = [
  'All',
  'Electronics',
  'Lab & Academic',
  'Media & Events',
  'Sports & Dorm',
  'Free / Donate'
];

export const ResourceCatalog: React.FC<ResourceCatalogProps> = ({
  resources,
  onSelectResource,
  onOpenBeaconDrawer
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('All');
  const [selectedHostel, setSelectedHostel] = useState<string>('All Hostels');
  const [sortBy, setSortBy] = useState<'nearest' | 'price_low' | 'rating'>('nearest');

  // Multi-criteria filtering engine (PS Section 3)
  const filteredResources = useMemo(() => {
    return resources
      .filter(item => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCategory = item.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Hostel filter
        if (selectedHostel !== 'All Hostels' && !item.ownerHostel.includes(selectedHostel)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceMinutes - b.distanceMinutes;
        if (sortBy === 'price_low') return a.hourlyRateRupees - b.hourlyRateRupees;
        if (sortBy === 'rating') return b.totalBorrowsCount - a.totalBorrowsCount;
        return 0;
      });
  }, [resources, searchQuery, selectedCategory, selectedHostel, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedHostel('All Hostels');
    setSortBy('nearest');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Campus Resource Catalog</h2>
          <p className="text-xs text-slate-400">
            Browse verified academic, media, and dorm resources available across your college hostels.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search equipment, labs, tools..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar (Category Tabs + Hostel Dropdown + Sort) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown Filters (Hostel & Sort) */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedHostel}
              onChange={e => setSelectedHostel(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Hostels">All Campus Hostels</option>
              <option value="Hostel 1">Hostel 1 (Aryabhatta)</option>
              <option value="Hostel 2">Hostel 2 (Kalpana Chawla)</option>
              <option value="Hostel 3">Hostel 3 (CV Raman)</option>
              <option value="Hostel 4">Hostel 4 (Visvesvaraya)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="nearest">Walking Distance</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="rating">Most Borrowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onSelectResource={onSelectResource}
            />
          ))}
        </div>
      ) : (
        /* Empty State Fallback (PS Section 5 - Community Requests) */
        <div className="w-full max-w-md mx-auto p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 my-8 space-y-4">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <SearchX className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-1">
              No gear found matching your criteria
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              The item may be in active use by another student. Broadcast an instant campus beacon request!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
            <button
              onClick={onOpenBeaconDrawer}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-colors"
            >
              <Radio className="h-3.5 w-3.5 text-indigo-200 animate-pulse" />
              Broadcast Wanted Beacon
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
