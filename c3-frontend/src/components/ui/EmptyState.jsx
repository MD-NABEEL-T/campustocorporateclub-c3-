import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are currently no items to display in this section.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#10273D]/40',
        className
      )}
    >
      <div className="p-4 rounded-full bg-[#071A2B] border border-white/10 text-[#94A3B8] mb-4">
        <Icon className="w-8 h-8 text-[#38BDF8]" />
      </div>
      <h3 className="text-lg font-bold font-heading text-[#F8FAFC]">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mt-1 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
