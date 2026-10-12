import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CourseWorkspacePage } from './features/courses/CourseWorkspacePage';
import { UploadCoursePage } from './features/upload/UploadCoursePage';
import { ProcessingStatusPage } from './features/upload/ProcessingStatusPage';
import { WeeklyNotesPage } from './features/notes/WeeklyNotesPage';
import { QuestionBankPage } from './features/questions/QuestionBankPage';
import { MockTestPage } from './features/quizzes/MockTestPage';
import { AskAIPage } from './features/chat/AskAIPage';
import { ProgressPage } from './features/progress/ProgressPage';
import { SettingsPage } from './features/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="course" element={<CourseWorkspacePage />} />
            <Route path="upload" element={<UploadCoursePage />} />
            <Route path="status" element={<ProcessingStatusPage />} />
            <Route path="notes" element={<WeeklyNotesPage />} />
            <Route path="questions" element={<QuestionBankPage />} />
            <Route path="mock-test" element={<MockTestPage />} />
            <Route path="chat" element={<AskAIPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
