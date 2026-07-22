import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 rounded-md px-1 py-0.5 text-slate-400 transition-colors hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            {item.path && index < items.length - 1 ? (
              <Link
                to={item.path}
                className="rounded-md px-1 py-0.5 text-slate-500 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="rounded-md px-1 py-0.5 font-medium text-slate-700" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
