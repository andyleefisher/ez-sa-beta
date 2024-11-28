import { useState } from 'react';
import { InfiniteCanvas } from './components/Canvas/InfiniteCanvas';
import { StartPage } from './components/StartPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {hasStarted ? (
        <InfiniteCanvas />
      ) : (
        <StartPage onStart={() => setHasStarted(true)} />
      )}
      <Toaster />
    </div>
  );
}

export default App;