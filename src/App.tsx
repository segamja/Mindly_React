import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/Home/HomePage';
import { CoachPage } from '@/pages/Coach/CoachPage';
import { BreathePage } from '@/pages/Breathe/BreathePage';
import { LibraryPage } from '@/pages/Library/LibraryPage';
import { JournalPage } from '@/pages/Journal/JournalPage';
import { MindReportPage } from '@/pages/MindReport/MindReportPage';
import { RecoveryPage } from '@/pages/Recovery/RecoveryPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/coach" element={<CoachPage />} />
      <Route path="/breathe" element={<BreathePage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/report" element={<MindReportPage />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
