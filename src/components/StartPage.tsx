import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface StartPageProps {
  onStart: () => void;
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-gray-50/50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <img 
            src="/logo.png" 
            alt="EZ-SA Builder Logo" 
            className="w-[400px] mx-auto mb-8"
          />
          <Button
            size="lg"
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6"
          >
            Start Building
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}