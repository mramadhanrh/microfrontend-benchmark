import type { PageInfo } from '../types/benchmark';

interface PageSelectorProps {
  pages: PageInfo[];
  activePage: string;
  onPageChange: (pageId: string) => void;
}

export default function PageSelector({
  pages,
  activePage,
  onPageChange,
}: PageSelectorProps) {
  const allOptions = [
    ...pages.map((p) => ({ id: p.id, label: p.label })),
    { id: 'all', label: 'All Pages' },
  ];

  return (
    <nav className="flex items-center gap-1">
      {allOptions.map((option) => {
        const isActive = activePage === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onPageChange(option.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isActive
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}
