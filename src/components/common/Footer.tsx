import { APP_VERSION } from '../../utils/constants';

interface FooterProps {
  version?: string;
  developer?: string;
}

export function Footer({ version = APP_VERSION, developer = 'ExamEye Team' }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-olive/10 px-4 py-4 lg:px-6" role="contentinfo">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
        <span>© {year} ExamEye. All rights reserved.</span>
        <span className="text-slate-300">Developed by {developer}</span>
        <span>v{version}</span>
      </div>
    </footer>
  );
}
