import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'good' | 'broken' | 'Finished' | 'Reschedule' | 'Schedule';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    good: 'bg-success/20 text-success border-success/30',
    broken: 'bg-destructive/20 text-destructive border-destructive/30',
    Finished: 'bg-success/20 text-success border-success/30',
    Reschedule: 'bg-warning/20 text-warning border-warning/30',
    Schedule: 'bg-primary/20 text-primary border-primary/30',
  };

  const labels = {
    good: 'Bagus',
    broken: 'Rusak',
    Finished: 'Selesai',
    Reschedule: 'Dijadwalkan Ulang',
    Schedule: 'Dijadwalkan',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
      styles[status]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'good' || status === 'Finished' ? 'bg-success' :
        status === 'broken' ? 'bg-destructive' :
        status === 'Reschedule' ? 'bg-warning' : 'bg-primary'
      )} />
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
