import { Navigate, Route, Routes } from 'react-router-dom';
import { SanctuaryProvider, useSanctuary } from './ethereal/context';
import { MainShell } from './ethereal/layout';
import { FocusPage } from './ethereal/pages/FocusPage';
import { FlowPage } from './ethereal/pages/FlowPage';
import { InsightsFeedPage } from './ethereal/pages/InsightsFeedPage';
import { InsightsTrendsPage } from './ethereal/pages/InsightsTrendsPage';
import { ProfilePage } from './ethereal/pages/ProfilePage';
import { ReschedulePage } from './ethereal/pages/ReschedulePage';
import { ReviewPage } from './ethereal/pages/ReviewPage';
import { SetupPage } from './ethereal/pages/SetupPage';
import { TasksPage } from './ethereal/pages/TasksPage';

function DefaultRoute() {
  const { setup } = useSanctuary();

  return <Navigate replace to={setup.completed ? '/flow' : '/setup'} />;
}

export default function App() {
  return (
    <SanctuaryProvider>
      <Routes>
        <Route element={<DefaultRoute />} path="/" />
        <Route element={<SetupPage />} path="/setup" />
        <Route element={<MainShell />}>
          <Route element={<FlowPage />} path="/flow" />
          <Route element={<TasksPage />} path="/tasks" />
          <Route element={<FocusPage />} path="/focus" />
          <Route element={<Navigate replace to="/intelligence/feed" />} path="/intelligence" />
          <Route element={<InsightsFeedPage />} path="/intelligence/feed" />
          <Route element={<InsightsTrendsPage />} path="/intelligence/trends" />
          <Route element={<ReviewPage />} path="/intelligence/review" />
          <Route element={<ReschedulePage />} path="/reschedule" />
          <Route element={<ProfilePage />} path="/profile" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </SanctuaryProvider>
  );
}
