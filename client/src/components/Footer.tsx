import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onExportConstitutionPdf: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onExportConstitutionPdf,
}) => {
  return (
    <footer className="w-full border-t border-border-default bg-surface-card/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-colors mt-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-content-muted">
        {/* Left: Minimal live system telemetry */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-medium text-content-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
            </span>
            System Operational
          </span>
          <span className="text-border-active">•</span>
          <span className="font-mono text-[11px]">10:25 AM Cutoff Active</span>
          <span className="text-border-active">•</span>
          <span className="font-mono text-[11px]">Dhaka, BD (UTC+6)</span>
        </div>

        {/* Right: Clean navigation & attribution */}
        <div className="flex items-center gap-4 text-xs font-medium text-content-secondary">
          <button
            onClick={() => onNavigateTab('constitution')}
            className="hover:text-content-primary transition cursor-pointer"
          >
            Constitution
          </button>
          <button
            onClick={onExportConstitutionPdf}
            className="hover:text-content-primary transition cursor-pointer"
          >
            Export PDF
          </button>
          <button
            onClick={() => onNavigateTab('simulator')}
            className="hover:text-content-primary transition cursor-pointer"
          >
            WhatsApp Lab
          </button>
          <span className="text-border-active">•</span>
          <span className="text-content-muted">© 2026 PenaltyCloud • Mahbub Alam</span>
        </div>
      </div>
    </footer>
  );
};
