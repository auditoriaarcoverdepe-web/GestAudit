import React, { useState, useEffect } from 'react';
import { Audit, Finding, Recommendation, AuditorProfile, Institution, InstitutionType, AuditStage, Risk } from './types';
import * as db from './supabase-database';
import { HomeIcon, CalendarIcon, DocumentTextIcon, ChartPieIcon, CogIcon, LogoutIcon, ClipboardListIcon, SparklesIcon } from './components/Icons';
import Dashboard from './components/Dashboard';
import AuditPlan from './components/AuditPlan';
import AuditDetail from './components/AuditDetail';
import AuditForm from './components/AuditForm';
import FindingForm from './components/FindingForm';
import RecommendationForm from './components/RecommendationForm';
import FindingsList from './components/FindingsList';
import RecommendationsList from './components/RecommendationsList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import InstitutionSelection from './components/InstitutionSelection';
import AuditStageForm from './components/AuditStageForm';
import RiskMatrix from './components/RiskMatrix';
import RiskForm from './components/RiskForm';
import { exportData } from './supabase-database';


type View = 'dashboard' | 'plan' | 'findings' | 'recommendations' | 'reports' | 'settings' | 'riskMatrix';

const App: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [auditStages, setAuditStages] = useState<AuditStage[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [profile, setProfile] = useState<AuditorProfile>({name: '', role: '', email: '', signature: ''});
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const [isAuditFormOpen, setIsAuditFormOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | undefined>(undefined);

  const [isFindingFormOpen, setIsFindingFormOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | undefined>(undefined);

  const [isRecommendationFormOpen, setIsRecommendationFormOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | undefined>(undefined);

  const [isStageFormOpen, setIsStageFormOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<AuditStage | undefined>(undefined);
  
  const [isRiskFormOpen, setIsRiskFormOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | undefined>(undefined);


  useEffect(() => {
    const initDB = async () => {
      await db.initializeDatabase();
      const appData = await db.loadAllData();
      setAudits(appData.audits);
      setFindings(appData.findings);
      setRecommendations(appData.recommendations);
      setAuditStages(appData.auditStages);
      setRisks(appData.risks);
      setProfile(appData.profile);
      setInstitutions(appData.institutions);
    };
    initDB();

    const storedAuth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(storedAuth === 'true');
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('isAuthenticated', String(isAuthenticated));
    } catch (error) {
      console.error("Failed to save auth state to localStorage", error);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedInstitutionId(null);
  };
  const handleAddInstitution = async (municipalityName: string, type: InstitutionType, cnpj: string) => {
    await db.saveInstitution(municipalityName, type, cnpj);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setInstitutions(appData.institutions);
  };

  const handleDeleteInstitution = async (institutionId: string) => {
    await db.deleteInstitution(institutionId);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setInstitutions(appData.institutions);
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
  };

  const handleProfileChange = (newProfile: AuditorProfile) => {
    db.saveProfile(newProfile);
    setProfile(newProfile);
  };

  // --- CRUD Operations ---
  const handleSaveAudit = async (auditData: Omit<Audit, 'id'> | Audit) => {
    if (!selectedInstitutionId) {
      alert('Selecione uma instituição antes de cadastrar uma auditoria.');
      return;
    }
    await db.saveAudit(auditData, selectedInstitutionId);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
    setIsAuditFormOpen(false);
    setEditingAudit(undefined);
  };

  const handleDeleteAudit = async (auditId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta auditoria e todos os seus dados associados (riscos, achados, etc)?")) {
        const { audits, findings, recommendations, auditStages, risks } = await db.deleteAudit(auditId);
        setAudits(audits);
        setFindings(findings);
        setRecommendations(recommendations);
        setAuditStages(auditStages);
        setRisks(risks);
        setSelectedAudit(null);
    }
  };
  
  const handleSaveFinding = async (findingData: Omit<Finding, 'id'> | Finding) => {
    await db.saveFinding(findingData);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
    setIsFindingFormOpen(false);
    setEditingFinding(undefined);
  };

  const handleDeleteFinding = async (findingId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este achado e suas recomendações?")) {
        const { findings, recommendations } = await db.deleteFinding(findingId);
        setFindings(findings);
        setRecommendations(recommendations);
    }
  };

  const handleSaveRecommendation = async (recData: Omit<Recommendation, 'id'> | Recommendation) => {
    await db.saveRecommendation(recData);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
    setIsRecommendationFormOpen(false);
    setEditingRecommendation(undefined);
  };
    
  const handleDeleteRecommendation = async (recId: string) => {
    if(window.confirm("Tem certeza que deseja excluir esta recomendação?")){
      const updatedRecommendations = await db.deleteRecommendation(recId);
      setRecommendations(updatedRecommendations);
    }
  };

  const handleSaveAuditStage = async (stageData: Omit<AuditStage, 'id'> | AuditStage) => {
    await db.saveAuditStage(stageData);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
  };

  const handleDeleteAuditStage = async (stageId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta fase do plano de trabalho?")) {
      const updatedStages = await db.deleteAuditStage(stageId);
      setAuditStages(updatedStages);
    }
  };

  const handleSaveRisk = async (riskData: Omit<Risk, 'id' | 'riskLevel'> | Risk) => {
    await db.saveRisk(riskData);
    // Reload all data to ensure consistency
    const appData = await db.loadAllData();
    setAudits(appData.audits);
    setFindings(appData.findings);
    setRecommendations(appData.recommendations);
    setAuditStages(appData.auditStages);
    setRisks(appData.risks);
    setIsRiskFormOpen(false);
    setEditingRisk(undefined);
  };
  
  const handleDeleteRisk = async (riskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este risco?")) {
      const updatedRisks = await db.deleteRisk(riskId);
      setRisks(updatedRisks);
    }
  };

  // --- UI Handlers ---
  const handleSelectAudit = (audit: Audit) => setSelectedAudit(audit);
  const handleBackToPlan = () => setSelectedAudit(null);
  
  const handleNewAudit = () => {
    setEditingAudit(undefined);
    setIsAuditFormOpen(true);
  };

  const handleEditAudit = () => {
      if(selectedAudit) {
          setEditingAudit(selectedAudit);
          setIsAuditFormOpen(true);
      }
  };
  
  const handleNewFinding = () => {
    setEditingFinding(undefined);
    setIsFindingFormOpen(true);
  };

  const handleNewRecommendation = () => {
    setEditingRecommendation(undefined);
    setIsRecommendationFormOpen(true);
  };
  
  const handleNewRisk = () => {
    setEditingRisk(undefined);
    setIsRiskFormOpen(true);
  };

  // --- RENDER LOGIC ---

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!selectedInstitutionId) {
    return <InstitutionSelection institutions={institutions} onAddInstitution={handleAddInstitution} onSelectInstitution={setSelectedInstitutionId} onDeleteInstitution={handleDeleteInstitution} onLogout={handleLogout} />;
  }

  // Filter data based on selected institution
  const currentAudits = audits.filter(a => a.institutionId === selectedInstitutionId);
  const currentAuditIds = new Set(currentAudits.map(a => a.id));
  const currentFindings = findings.filter(f => currentAuditIds.has(f.auditId));
  const currentFindingIds = new Set(currentFindings.map(f => f.id));
  const currentRecommendations = recommendations.filter(r => currentFindingIds.has(r.findingId));
  const currentRisks = risks.filter(r => currentAuditIds.has(r.auditId));
  const selectedInstitution = institutions.find(i => i.id === selectedInstitutionId);
  
  const getInstitutionDisplayName = (institution?: Institution) => {
    if (!institution) return '';
    return institution.type === InstitutionType.PREFEITURA
      ? `Prefeitura de ${institution.municipalityName}`
      : `${institution.type} de ${institution.municipalityName}`;
  };


  const renderContent = () => {
    if (selectedAudit) {
      return (
        <AuditDetail
          audit={selectedAudit}
          findings={findings.filter(f => f.auditId === selectedAudit.id)}
          recommendations={recommendations.filter(r => findings.some(f => f.id === r.findingId && f.auditId === selectedAudit.id))}
          auditStages={auditStages.filter(s => s.auditId === selectedAudit.id)}
          risks={risks.filter(r => r.auditId === selectedAudit.id)}
          onBack={handleBackToPlan}
          onEdit={handleEditAudit}
          onDelete={() => handleDeleteAudit(selectedAudit.id)}
          onNewFinding={handleNewFinding}
          onSaveFinding={handleSaveFinding}
          onDeleteFinding={handleDeleteFinding}
          onSaveRecommendation={handleSaveRecommendation}
          onDeleteRecommendation={handleDeleteRecommendation}
          onSaveAuditStage={handleSaveAuditStage}
          onDeleteAuditStage={handleDeleteAuditStage}
          onSaveRisk={handleSaveRisk}
          onDeleteRisk={handleDeleteRisk}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard audits={currentAudits} findings={currentFindings} recommendations={currentRecommendations} />;
      case 'plan':
        return <AuditPlan audits={currentAudits} onSelectAudit={handleSelectAudit} onNewAudit={handleNewAudit} />;
      case 'riskMatrix':
        return <RiskMatrix risks={currentRisks} audits={currentAudits} onNewRisk={handleNewRisk} onSaveRisk={handleSaveRisk} onDeleteRisk={handleDeleteRisk}/>;
      case 'findings':
        return <FindingsList findings={currentFindings} audits={currentAudits} onSelectAudit={handleSelectAudit} onNewFinding={handleNewFinding} />;
      case 'recommendations':
        return <RecommendationsList recommendations={currentRecommendations} findings={currentFindings} audits={currentAudits} onSelectAudit={handleSelectAudit} onNewRecommendation={handleNewRecommendation} />;
      case 'reports':
        return <Reports audits={currentAudits} findings={currentFindings} recommendations={currentRecommendations} risks={currentRisks} />;
      case 'settings':
        return <Settings profile={profile} onProfileChange={handleProfileChange} onExportData={exportData} />;

      default:
        return <Dashboard audits={currentAudits} findings={currentFindings} recommendations={currentRecommendations} />;
    }
  };

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => { setCurrentView(view); setSelectedAudit(null); }}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
        currentView === view && !selectedAudit ? 'bg-azul-claro text-white' : 'text-gray-600 hover:bg-cinza-claro'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-cinza-claro font-sans app-container">
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col no-print">
        <div className="h-20 flex items-center justify-center border-b">
          <div className="flex items-center gap-3">
            <img src="/Logo1.png" alt="Logo" className="w-10 h-10" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-azul-escuro">GestAudit</h1>
              <p className="text-sm text-gray-500 -mt-1">Gestão de Auditoria</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow mt-4">
          <NavItem view="dashboard" label="Dashboard" icon={<HomeIcon className="w-6 h-6" />} />
          <NavItem view="plan" label="Plano de Auditorias" icon={<CalendarIcon className="w-6 h-6" />} />
          <NavItem view="riskMatrix" label="Matriz de Riscos" icon={<ClipboardListIcon className="w-6 h-6" />} />
          <NavItem view="findings" label="Banco de Achados" icon={<DocumentTextIcon className="w-6 h-6" />} />
          <NavItem view="recommendations" label="Plano de Ação" icon={<DocumentTextIcon className="w-6 h-6" />} />
          <NavItem view="reports" label="Relatórios" icon={<ChartPieIcon className="w-6 h-6" />} />

          <NavItem view="settings" label="Configurações" icon={<CogIcon className="w-6 h-6" />} />
        </nav>
        <div className="p-4 border-t">
            <div className='mb-4 bg-cinza-claro p-2 rounded-md'>
                <p className="text-xs text-gray-500 uppercase">Instituição Ativa</p>
                <p className="font-semibold text-azul-escuro truncate" title={getInstitutionDisplayName(selectedInstitution)}>{getInstitutionDisplayName(selectedInstitution)}</p>
            </div>
            <button onClick={() => setSelectedInstitutionId(null)} className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 text-sm mb-2">
                Trocar Instituição
            </button>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 text-center bg-vermelho-status text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
            >
              <LogoutIcon className="w-5 h-5" />
              Sair
            </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto main-content">
        {renderContent()}
      </main>

      {isAuditFormOpen && (
          <AuditForm 
            audit={editingAudit}
            onSave={handleSaveAudit}
            onClose={() => {setIsAuditFormOpen(false); setEditingAudit(undefined);}}
          />
      )}

      {isFindingFormOpen && (
        <FindingForm
          auditId={selectedAudit?.id}
          finding={editingFinding}
          audits={currentAudits}
          recommendations={[]}
          onSaveFinding={handleSaveFinding}
          onClose={() => { setIsFindingFormOpen(false); setEditingFinding(undefined); }}
          onSaveRecommendation={handleSaveRecommendation}
          onDeleteRecommendation={handleDeleteRecommendation}
        />
      )}

      {isRecommendationFormOpen && (
        <RecommendationForm
          recommendation={editingRecommendation}
          findings={currentFindings}
          audits={currentAudits}
          onSave={handleSaveRecommendation}
          onClose={() => { setIsRecommendationFormOpen(false); setEditingRecommendation(undefined); }}
        />
      )}

      {isRiskFormOpen && (
        <RiskForm
          risk={editingRisk}
          audits={currentAudits}
          onSave={handleSaveRisk}
          onClose={() => { setIsRiskFormOpen(false); setEditingRisk(undefined); }}
        />
      )}
    </div>
  );
};

export default App;