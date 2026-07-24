import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import SignInPage from '@/pages/auth/SignIn';
import SignUpPage from '@/pages/auth/SignUp';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import DocumentEditor from '@/pages/DocumentEditor';
import Profile from '@/pages/Profile';
import Templates from '@/pages/Templates';
import Recent from '@/pages/Recent';
import Shared from '@/pages/Shared';
import Trash from '@/pages/Trash';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Landing />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent"
        element={
          <ProtectedRoute>
            <Recent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shared"
        element={
          <ProtectedRoute>
            <Shared />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
