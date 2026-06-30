import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CampanhasPage from "./pages/CampanhasPage";
import ContratosPage from "./pages/ContratosPage";
import DelegacoesPage from "./pages/DelegacoesPage";
import AdmscoreLoginPage from "./pages/AdmscoreLoginPage";
import AdmscoreHomePage from "./pages/AdmscoreHomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/campanhas" element={<CampanhasPage />} />
      <Route path="/contratos" element={<ContratosPage />} />
      <Route path="/delegacoes" element={<DelegacoesPage />} />
      <Route path="/admscore/login" element={<AdmscoreLoginPage />} />
      <Route path="/admscore" element={<AdmscoreHomePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
