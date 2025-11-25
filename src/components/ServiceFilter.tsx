import clsx from 'clsx';
import type { FilterType } from '../types/ui';

interface ServiceFilterProps {
  filterService: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterOptions = [
  { value: 'all' as FilterType, label: 'All Services', icon: '🚢' },
  { value: 'citycat' as FilterType, label: 'CityCat', icon: '🔵' },
  { value: 'cross-river' as FilterType, label: 'Cross River', icon: '🟠' },
];

export function ServiceFilter({ filterService, onFilterChange }: ServiceFilterProps) {
  return (
    <div className="absolute top-24 left-4 z-[1000] bg-white rounded-full shadow-lg p-1 flex gap-1">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={clsx(
            'px-4 py-2 rounded-full font-medium transition-all text-sm',
            filterService === option.value
              ? 'bg-golden text-white shadow-md'
              : 'text-charcoal hover:bg-cream'
          )}
          aria-pressed={filterService === option.value}
          aria-label={`Show ${option.label}`}
        >
          <span className="mr-2">{option.icon}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
