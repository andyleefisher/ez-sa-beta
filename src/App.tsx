import { InfiniteCanvas } from './components/Canvas/InfiniteCanvas';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="h-screen w-screen">
      <InfiniteCanvas />
      <Toaster />
    </div>
  );
}

export default App;