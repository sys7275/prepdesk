import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import UPSSSC from "./pages/UPSSSC";
import UPESSC from "./pages/UPESSC";
import SSC from "./pages/SSC";
import Railway from "./pages/Railway";
import GATE from "./pages/GATE";
import PET from "./pages/PET";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUpload from "./pages/AdminUpload";
import PracticeHome from "./pages/practice/PracticeHome";
import PracticeCategory from "./pages/practice/PracticeCategory";
import PracticeExam from "./pages/practice/PracticeExam";

function ExamPractice({ defaultCategory, defaultExam }) {
  return (
    <PracticeExam
      defaultCategory={defaultCategory}
      defaultExam={defaultExam}
    />
  );
}

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />

      {/* Protected Website Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upessc"
        element={
          <ProtectedRoute>
            <UPESSC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upsssc"
        element={
          <ProtectedRoute>
            <UPSSSC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upsssc/pet"
        element={
          <ProtectedRoute>
            <PET />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upsssc/pet/practice"
        element={
          <ProtectedRoute>
            <ExamPractice defaultCategory="upsssc" defaultExam="pet" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upsssc/pet/practice/:set"
        element={
          <ProtectedRoute>
            <ExamPractice defaultCategory="upsssc" defaultExam="pet" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ssc"
        element={
          <ProtectedRoute>
            <SSC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/railway"
        element={
          <ProtectedRoute>
            <Railway />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gate"
        element={
          <ProtectedRoute>
            <GATE />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gate/:paper"
        element={
          <ProtectedRoute>
            <GATE />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ssc/:exam"
        element={
          <ProtectedRoute>
            <SSC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/railway/:exam"
        element={
          <ProtectedRoute>
            <Railway />
          </ProtectedRoute>
        }
      />

      <Route
        path="/test/*"
        element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/result/*"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/:type/:category/:exam/:set"
        element={
          <ProtectedRoute>
            <AdminUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/:category/:exam"
        element={
          <ProtectedRoute>
            <AdminUpload />
          </ProtectedRoute>
        }
      />

      {/* Practice */}
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice/:category"
        element={
          <ProtectedRoute>
            <PracticeCategory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice/:category/:exam"
        element={
          <ProtectedRoute>
            <PracticeExam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice/:category/:exam/:set"
        element={
          <ProtectedRoute>
            <PracticeExam />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;