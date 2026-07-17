import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';

import Home from '@/pages/Home';
import GamePage from '@/pages/GamePage';
import ScoreboardPage from '@/pages/ScoreboardPage';
import PointsDetail from "@/pages/PointsDetail";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="*" element={<PageNotFound />} />
            <Route
                path="/pointsdetail"
                element={<PointsDetail />}
            />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;