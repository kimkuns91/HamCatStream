import { FaSpinner } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  colors?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ colors }) => {
  return (
    <FaSpinner
      className={cn(
        'animate-spin',
        colors ? `text-[${colors}]` : 'text-slate-700'
      )}
      aria-label="Loading spinner"
    />
  );
};

export default Spinner;