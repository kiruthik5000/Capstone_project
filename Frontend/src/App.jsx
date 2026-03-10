import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LiveMonitor from './pages/LiveMonitor';
import ModelEvaluation from './pages/ModelEvaluation';
import Alert from './pages/Alert';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<LiveMonitor />} />
            <Route path="/evaluation" element={<ModelEvaluation />} />
            <Route path="/alerts" element={<Alert/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
