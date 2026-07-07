import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CampanhasPage from "./pages/CampanhasPage";
import ContratosPage from "./pages/ContratosPage";
import DelegacoesPage from "./pages/DelegacoesPage";
import AdmscoreLoginPage from "./pages/AdmscoreLoginPage";
import AdmscoreUsuariosPage from "./pages/AdmscoreUsuariosPage";
import AdmscoreSessoesPage from "./pages/AdmscoreSessoesPage";
import AdmscoreCampanhasPage from "./pages/AdmscoreCampanhasPage";
import AdmscoreSecaoPage from "./pages/AdmscoreSecaoPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/campanhas" element={<CampanhasPage />} />
      <Route path="/contratos" element={<ContratosPage />} />
      <Route path="/delegacoes" element={<DelegacoesPage />} />
      <Route path="/admscore/login" element={<AdmscoreLoginPage />} />
      <Route path="/admscore/usuarios" element={<AdmscoreUsuariosPage />} />
      <Route path="/admscore/sessoes" element={<AdmscoreSessoesPage />} />
      <Route path="/admscore/campanhas" element={<AdmscoreCampanhasPage />} />
      <Route path="/admscore/cargas" element={<AdmscoreSecaoPage secao="cargas" />} />
      <Route path="/admscore/catalogos" element={<AdmscoreSecaoPage secao="catalogos" />} />
      <Route path="/admscore/clientes" element={<AdmscoreSecaoPage secao="clientes" />} />
      <Route path="/admscore" element={<Navigate to="/admscore/usuarios" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
