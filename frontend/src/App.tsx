import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { DemoPage } from './pages/DemoPage';
import { LessonPage } from './pages/LessonPage';
import { ChallengePage } from './pages/ChallengePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/demo" replace />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/challenges/:challengeId" element={<ChallengePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

