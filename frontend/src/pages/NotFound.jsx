import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 rounded-2xl bg-[#EFE8DE] dark:bg-[#2A1C15] text-[#7B4B32] dark:text-[#D4AF37] mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-[#665349] dark:text-[#C8B7AC] max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button variant="gold" size="md" onClick={() => navigate('/')} leftIcon={Home}>
        Return to Dashboard
      </Button>
    </div>
  );
};
