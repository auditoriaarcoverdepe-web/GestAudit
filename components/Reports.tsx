import React, { useState, useMemo } from 'react';
import { Audit, Finding, Recommendation, AuditStatus, RecommendationStatus, Risk, RiskLevel, CustomReportSection } from '../types';
import { ChartPieIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './Icons';
import { getStatusColor as getAuditStatusColor, getPriorityColor } from './AuditPlan';
import { getRiskLevelColor } from './RiskMatrix';
import ReportSectionEditor from './ReportSectionEditor';
import RiskMatrixSection from './RiskMatrixSection'; // Importando o novo componente

interface ReportsProps {
  audits: Audit[];
  findings: Finding[];
  recommendations: Recommendation[];
  risks: Risk[];
  customReportSections: CustomReportSection[]; // Novo prop: Seções persistidas
  onSaveCustomSection: (section: Omit<CustomReportSection, 'id'> | CustomReportSection) => Promise<void>; // Novo handler
  onDeleteCustomSection: (sectionId: string) => Promise<void>; // Novo handler
}

// --- Helper Functions ---
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'N/A';

// --- Sub-components for each report type ---

interface IndividualReportProps {
    audit: Audit;
    findings: Finding[];
    recommendations: Recommendation[];
    risks: Risk[]; 
    customSections: CustomReportSection[]; // Agora são as seções filtradas e persistidas
    includeRiskMatrix: boolean; 
    onNewSection: () => void;
    onEditSection: (section: CustomReportSection) => void;
    onDeleteSection: (id: string) => void;
}

const IndividualReport: React.FC<IndividualReportProps> = ({ audit, findings, recommendations, risks, customSections, includeRiskMatrix, onNewSection, onEditSection, onDeleteSection }) => {
  
  // Seções automáticas baseadas no planejamento
  const objectiveSection: CustomReportSection = {
      id: 'audit-objective',
      auditId: audit.id,
      title: 'Objetivo da Auditoria',
      content: audit.objective || 'Não especificado.',
      sequence: 100,
  };
  
  const scopeSection: CustomReportSection = {
      id: 'audit-scope',
      auditId: audit.id,
      title: 'Escopo da Auditoria',
      content: audit.scope || 'Não especificado.',
      sequence: 200,
  };
  
  const criteriaSection: CustomReportSection = {
      id: 'audit-criteria',
      auditId: audit.id,
      title: 'Critérios e Normas Aplicáveis',
      content: audit.criteria || 'Não especificado.',
      sequence: 300,
  };
  
  // Seção da Matriz de Riscos (Automática, opcional)
  const riskMatrixSection: CustomReportSection = {
      id: 'risk-matrix',
      auditId: audit.id,
      title: 'Matriz de Riscos da Auditoria',
      content: '', 
      sequence: 500, 
  };
  
  // Seção de Achados/Recomendações (Core Section)
  const findingSection: CustomReportSection = {
      id: 'findings-recs',
      auditId: audit.id,
      title: 'Achados e Recomendações',
      content: '', 
      sequence: 999, 
  };
  

  // Combina todas as seções
  const allSections = useMemo(() => {
      let sections: CustomReportSection[] = [
          objectiveSection,
          scopeSection,
          criteriaSection,
          ...customSections // Seções persistidas
      ];
      
      if (includeRiskMatrix) {
          sections.push(riskMatrixSection);
      }
      
      // Adiciona a seção de achados/recomendações se houver dados ou se for a única seção restante
      if (findings.length > 0 || sections.length === 3) { // 3 = objective, scope, criteria
          sections.push(findingSection);
      }
      
      // Ordena por sequência
      return sections.sort((a, b) => a.sequence - b.sequence);
  }, [customSections, findings, includeRiskMatrix, audit]);
  
  const renderSectionContent = (section: CustomReportSection) => {
      if (section.id === 'risk-matrix') {
          return <RiskMatrixSection risks={risks} />;
      }
      
      if (section.id === 'findings-recs') {
          return (
            <div className="mt-6">
              {findings.length > 0 ? findings.map(finding => (
                <div key={finding.id} className="mb-4 border rounded-lg p-4">
                  <h4 className="font-bold text-justify">{finding.findingCode}: {finding.summary}</h4>
                  <p className="text-xs text-gray-600">Status: {finding.status} | Classificação: {finding.classification}</p>
                  <div className="mt-2 pl-4 border-l-2">
                    {recommendations.filter(r => r.findingId === finding.id).map(rec => (
                      <div key={rec.id} className="text-sm mt-2">
                        <p className="text-justify"><strong>{rec.recommendationCode}:</strong> {rec.description}</p>
                        <p className="text-xs text-gray-500">Prazo: {formatDate(rec.deadline)} | Status: {rec.status} | Responsável: {rec.implementationResponsible}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-gray-500">Nenhum achado registrado para esta auditoria.</p>}
            </div>
          );
      }
      
      // Renderiza conteúdo de seção personalizada ou as seções automáticas de planejamento
      return (
          <div className="whitespace-pre-wrap text-gray-700 text-justify">
              {section.content}
          </div>
      );
  }

  const isAutomaticSection = (id: string) => ['audit-objective', 'audit-scope', 'audit-criteria', 'findings-recs', 'risk-matrix'].includes(id);

  return (
    <div id="report-content-area">
        {/* Título principal visível apenas na impressão, centralizado e em preto */}
        <div className="hidden print:block text-center mb-6">
            <h2 className="text-2xl font-bold text-black">Relatório de Auditoria: {audit.auditNumber}</h2>
        </div>
        
        {/* Título principal visível apenas na tela, com botões de edição */}
        <div className="flex justify-between items-start mb-4 no-print">
            <h2 className="text-2xl font-bold text-azul-escuro">Relatório de Auditoria: {audit.auditNumber}</h2>
            <button 
                onClick={onNewSection} 
                className="flex items-center gap-1 bg-azul-claro text-white font-bold py-1 px-3 text-sm rounded-lg shadow hover:bg-azul-escuro transition duration-300"
            >
                <PlusCircleIcon className="w-4 h-4" /> Nova Seção
            </button>
        </div>
        
        {/* Audit Header Info - Simplified, removed Objective/Scope/Criteria */}
        <div className="space-y-4 mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">{audit.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Setor Auditado:</strong> {audit.auditedSector}</p>
                <p><strong>Status:</strong> {audit.status}</p>
                <p><strong>Período Previsto:</strong> {formatDate(audit.plannedStartDate)} - {formatDate(audit.plannedEndDate)}</p>
                <p><strong>Prioridade:</strong> {audit.priority}</p>
            </div>
        </div>

        {/* Render all sections in order */}
        {allSections.map((section, index) => (
            <div key={section.id} className="mb-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                        {index + 1}. {section.title}
                    </h3>
                    {!isAutomaticSection(section.id) && (
                        <div className="flex gap-2 no-print">
                            <button onClick={() => onEditSection(section)} className="text-azul-claro hover:text-azul-escuro" title="Editar Seção"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteSection(section.id)} className="text-vermelho-status hover:text-red-700" title="Excluir Seção"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
                {renderSectionContent(section)}
            </div>
        ))}
        
    </div>
  );
};

const AnnualReport: React.FC<{ year: string; audits: Audit[]; findings: Finding[]; recommendations: Recommendation[] }> = ({ year, audits, findings, recommendations }) => {
    // FIX: Add explicit type annotation for 'a' to prevent type inference issues.
    const yearAudits = audits.filter((a: Audit) => a.year.toString() === year);
    const auditIds = yearAudits.map(a => a.id);
    const yearFindings = findings.filter(f => auditIds.includes(f.auditId));
    const findingIds = yearFindings.map(f => f.id);
    const yearRecommendations = recommendations.filter(r => findingIds.includes(r.findingId));
    
    const verifiedRecommendations = yearRecommendations.filter(r => r.status === RecommendationStatus.VERIFIED).length;


    const statusCounts = yearAudits.reduce((acc, audit) => {
        acc[audit.status] = (acc[audit.status] || 0) + 1;
        return acc;
    }, {} as Record<AuditStatus, number>);

     const recStatusCounts = yearRecommendations.reduce((acc, rec) => {
        acc[rec.status] = (acc[rec.status] || 0) + 1;
        return acc;
    }, {} as Record<RecommendationStatus, number>);

  return(
    <div>
        <h2 className="text-2xl font-bold text-azul-escuro border-b pb-2 mb-4">Relatório Anual de Atividades de Auditoria - {year}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-cinza-claro rounded-lg text-center">
                <span className="text-3xl font-bold text-azul-escuro">{yearAudits.length}</span>
                <p className="text-sm text-gray-600">Auditorias</p>
            </div>
             <div className="p-4 bg-cinza-claro rounded-lg text-center">
                <span className="text-3xl font-bold text-azul-escuro">{yearFindings.length}</span>
                <p className="text-sm text-gray-600">Achados</p>
            </div>
             <div className="p-4 bg-cinza-claro rounded-lg text-center">
                <span className="text-3xl font-bold text-azul-escuro">{yearRecommendations.length}</span>
                <p className="text-sm text-gray-600">Recomendações</p>
            </div>
            <div className="p-4 bg-cinza-claro rounded-lg text-center">
                <span className="text-3xl font-bold text-verde-status">{verifiedRecommendations}</span>
                <p className="text-sm text-gray-600">Recom. Verificadas</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Status das Auditorias</h3>
                <ul className="space-y-1 text-sm">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <li key={status} className="flex justify-between"><span>{status}:</span> <span className="font-bold">{count}</span></li>
                ))}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Status das Recomendações</h3>
                <ul className="space-y-1 text-sm">
                 {Object.entries(recStatusCounts).map(([status, count]) => (
                    <li key={status} className="flex justify-between"><span>{status}:</span> <span className="font-bold">{count}</span></li>
                ))}
                </ul>
            </div>
        </div>
    </div>
  );
}

const PlanReport: React.FC<{ year: string; audits: Audit[]; }> = ({ year, audits }) => {
    // FIX: Add explicit type annotation for 'a' to prevent type inference issues.
    const yearAudits = audits.filter((a: Audit) => a.year.toString() === year);
    return (
        <div>
            <h2 className="text-2xl font-bold text-azul-escuro border-b pb-2 mb-4">Plano Anual de Auditoria - {year}</h2>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Número</th>
                        <th className="p-2">Título</th>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Período Previsto</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Prioridade</th>
                    </tr>
                </thead>
                <tbody>
                    {yearAudits.map(audit => (
                        <tr key={audit.id} className="border-b">
                            <td className="p-2 font-medium">{audit.auditNumber}</td>
                            <td className="p-2">{audit.title}</td>
                            <td className="p-2">{audit.type}</td>
                            <td className="p-2">{formatDate(audit.plannedStartDate)} - {formatDate(audit.plannedEndDate)}</td>
                            <td className="p-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getAuditStatusColor(audit.status)}`}>{audit.status}</span></td>
                            <td className="p-2"><span className={`${getPriorityColor(audit.priority)} font-semibold`}>{audit.priority}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {yearAudits.length === 0 && <p className="text-center text-gray-500 mt-4">Nenhuma auditoria encontrada para este ano.</p>}
        </div>
    );
}

const RiskMatrixReport: React.FC<{ year: string; audits: Audit[]; risks: Risk[] }> = ({ year, audits, risks }) => {
    // FIX: Add explicit type annotation for 'a' to prevent type inference issues.
    const auditMap = useMemo(() => new Map(audits.map((a: Audit) => [a.id, a])), [audits]);
    const yearAudits = audits.filter((a: Audit) => a.year.toString() === year);
    const yearAuditIds = new Set(yearAudits.map(a => a.id));
    const yearRisks = risks.filter(r => yearAuditIds.has(r.auditId));

    const riskCounts = yearRisks.reduce((acc, risk) => {
        acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
        return acc;
    }, {} as Record<RiskLevel, number>);

    const highPriorityRisks = yearRisks.filter(r =>
        r.riskLevel === RiskLevel.EXTREME || r.riskLevel === RiskLevel.HIGH
    ).sort((a, b) => {
        const levelOrder = { [RiskLevel.EXTREME]: 1, [RiskLevel.HIGH]: 2, [RiskLevel.MODERATE]: 3, [RiskLevel.LOW]: 4 };
        return levelOrder[a.riskLevel] - levelOrder[b.riskLevel];
    });

    return (
        <div>
            <h2 className="text-2xl font-bold text-azul-escuro border-b pb-2 mb-4">Resumo da Matriz de Riscos - {year}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.values(RiskLevel).map(level => {
                    const count = riskCounts[level] || 0;
                    return (
                        <div key={level} className={`p-4 rounded-lg text-center shadow ${getRiskLevelColor(level)}`}>
                            <span className="text-3xl font-bold">{count}</span>
                            <p className="text-sm font-semibold uppercase">{level}</p>
                        </div>
                    );
                })}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Riscos de Prioridade Alta e Extrema</h3>
            <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Auditoria</th>
                            <th className="p-2">Descrição do Risco</th>
                            <th className="p-2">Nível</th>
                            <th className="p-2">Controles Existentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highPriorityRisks.length > 0 ? highPriorityRisks.map(risk => (
                             <tr key={risk.id} className="border-b">
                                <td className="p-2 font-medium">{auditMap.get(risk.auditId)?.auditNumber}</td>
                                <td className="p-2">{risk.description}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getRiskLevelColor(risk.riskLevel)}`}>
                                        {risk.riskLevel}
                                    </span>
                                </td>
                                <td className="p-2 text-gray-600">{risk.controls}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center p-8 text-gray-500">Nenhum risco de prioridade alta ou extrema encontrado para este ano.</td></tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};


const Reports: React.FC<ReportsProps> = ({ audits, findings, recommendations, risks, customReportSections, onSaveCustomSection, onDeleteCustomSection }) => {
  const [reportType, setReportType] = useState('individual');
  const [selectedAuditId, setSelectedAuditId] = useState<string>(audits[0]?.id || '');
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  
  // State for managing the editor modal
  const [sectionEditorState, setSectionEditorState] = useState<{ section?: CustomReportSection } | null>(null);
  const [includeRiskMatrix, setIncludeRiskMatrix] = useState(false); 


  // FIX: Explicitly type 'a' in map to ensure correct type inference for 'audits'.
  const years = useMemo(() => [...new Set(audits.map((a: Audit) => a.year))].sort((a: number, b: number) => b-a), [audits]);

  const selectedAudit = useMemo(() => audits.find(a => a.id === selectedAuditId), [audits, selectedAuditId]);
  const selectedAuditFindings = useMemo(() => findings.filter(f => f.auditId === selectedAuditId), [findings, selectedAuditId]);
  const selectedAuditRecommendations = useMemo(() => {
    const findingIds = selectedAuditFindings.map(f => f.id);
    return recommendations.filter(r => findingIds.includes(r.findingId));
  }, [recommendations, selectedAuditFindings]);
  const selectedAuditRisks = useMemo(() => risks.filter(r => r.auditId === selectedAuditId), [risks, selectedAuditId]);
  
  // Filter custom sections based on selected audit
  const currentCustomSections = useMemo(() => customReportSections.filter(s => s.auditId === selectedAuditId), [customReportSections, selectedAuditId]);
  
  // Reset risk matrix toggle when audit changes
  React.useEffect(() => {
      setIncludeRiskMatrix(false);
  }, [selectedAuditId]);


  const handleNewSection = () => {
      if (!selectedAuditId) {
          alert('Selecione uma auditoria antes de adicionar uma seção.');
          return;
      }
      setSectionEditorState({});
  };
  
  const handleEditSection = (section: CustomReportSection) => {
      setSectionEditorState({ section });
  };
  
  const handleSaveSection = async (sectionData: Omit<CustomReportSection, 'id'> | CustomReportSection) => {
      await onSaveCustomSection(sectionData);
      setSectionEditorState(null);
  };
  
  const handleDeleteSection = async (id: string) => {
      await onDeleteCustomSection(id);
  };


  const renderReportContent = () => {
    switch (reportType) {
      case 'individual':
        if (!selectedAudit) return <p className="text-center text-gray-500 p-8">Por favor, selecione uma auditoria para gerar o relatório.</p>;
        return (
            <IndividualReport 
                audit={selectedAudit} 
                findings={selectedAuditFindings} 
                recommendations={selectedAuditRecommendations} 
                risks={selectedAuditRisks} 
                customSections={currentCustomSections} // Passando seções persistidas
                includeRiskMatrix={includeRiskMatrix} 
                onNewSection={handleNewSection}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
            />
        );
      case 'annual':
        return <AnnualReport year={selectedYear} audits={audits} findings={findings} recommendations={recommendations} />;
      case 'plan':
         return <PlanReport year={selectedYear} audits={audits} />;
      case 'riskMatrix':
         return <RiskMatrixReport year={selectedYear} audits={audits} risks={risks} />;
      default:
        return null;
    }
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
        window.print();
        return;
    }

    let csvContent = "";
    let fileName = 'relatorio.csv';

    if (reportType === 'individual' && selectedAudit) {
        fileName = `relatorio_auditoria_${selectedAudit.auditNumber}.csv`;
        const headers = ["AuditNumber", "AuditTitle", "FindingCode", "FindingSummary", "RecommendationCode", "RecommendationDescription", "Status", "Deadline", "Responsible"];
        csvContent += headers.join(',') + '\r\n';
        
        selectedAuditFindings.forEach(f => {
            const recs = recommendations.filter(r => r.findingId === f.id);
            if (recs.length > 0) {
                recs.forEach(r => {
                    const row = [selectedAudit.auditNumber, `"${selectedAudit.title}"`, f.findingCode, `"${f.summary}"`, r.recommendationCode, `"${r.description}"`, r.status, formatDate(r.deadline), `"${r.implementationResponsible}"`];
                    csvContent += row.join(',') + '\r\n';
                });
            } else {
                 const row = [selectedAudit.auditNumber, `"${selectedAudit.title}"`, f.findingCode, `"${f.summary}"`, "", "", "", "", ""];
                 csvContent += row.join(',') + '\r\n';
            }
        });
    } else if (reportType === 'annual' || reportType === 'plan') {
        fileName = `relatorio_anual_${selectedYear}.csv`;
        
        // Add headers for Annual/Plan Report
        const headers = ["Year", "AuditNumber", "Title", "Type", "Status", "Priority", "PlannedStart", "PlannedEnd", "TotalFindings", "TotalRecommendations"];
        csvContent += headers.join(',') + '\r\n';
        
        audits.filter((a: Audit) => a.year.toString() === selectedYear).forEach((a: Audit) => {
            const auditFindings = findings.filter(f => f.auditId === a.id);
            const findingIds = auditFindings.map(f => f.id);
            const auditRecs = recommendations.filter(r => findingIds.includes(r.findingId));
            const row = [a.year, a.auditNumber, `"${a.title}"`, a.type, a.status, a.priority, formatDate(a.plannedStartDate), formatDate(a.plannedEndDate), auditFindings.length, auditRecs.length];
            csvContent += row.join(',') + '\r\n';
        });
    } else if (reportType === 'riskMatrix') {
        fileName = `resumo_riscos_${selectedYear}.csv`;
        const headers = ["AuditNumber", "RiskDescription", "Impact", "Probability", "RiskLevel", "ExistingControls"];
        csvContent += headers.join(',') + '\r\n';
        
        const yearAudits = audits.filter((a: Audit) => a.year.toString() === selectedYear);
        const yearAuditIds = new Set(yearAudits.map((a: Audit) => a.id));
        const yearRisks = risks.filter(r => yearAuditIds.has(r.auditId));
        // FIX: Add explicit type annotation for 'a' to prevent type inference issues.
        const auditMap = new Map(audits.map((a: Audit) => [a.id, a]));

        yearRisks.forEach(risk => {
            const audit = auditMap.get(risk.auditId);
            const row = [
                audit?.auditNumber || 'N/A',
                `"${risk.description.replace(/"/g, '""')}"`,
                risk.impact,
                risk.probability,
                risk.riskLevel,
                `"${risk.controls.replace(/"/g, '""')}"`
            ];
            csvContent += row.join(',') + '\r\n';
        });
    }


    downloadCSV(csvContent, fileName);
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center space-x-2 mb-6 no-print">
        <ChartPieIcon className="w-8 h-8 text-azul-escuro" />
        <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Relatórios</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Tipo de Relatório</label>
                <select id="reportType" value={reportType} onChange={e => setReportType(e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                    <option value="individual">Relatório de Auditoria Individual</option>
                    <option value="annual">Relatório Anual de Atividades</option>
                    <option value="plan">Plano Anual de Auditoria</option>
                    <option value="riskMatrix">Resumo da Matriz de Riscos</option>
                </select>
            </div>
            
            {reportType === 'individual' && (
                <div>
                    <label htmlFor="auditId" className="block text-sm font-medium text-gray-700">Selecione a Auditoria</label>
                    <select id="auditId" value={selectedAuditId} onChange={e => setSelectedAuditId(e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                        <option value="" disabled>-- Selecione --</option>
                        {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
                    </select>
                </div>
            )}

             {(reportType === 'annual' || reportType === 'plan' || reportType === 'riskMatrix') && (
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Selecione o Ano</label>
                    <select id="year" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            )}

            <div className="flex gap-2 justify-self-end">
                <button onClick={() => handleExport('pdf')} className="bg-vermelho-status text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                    Exportar PDF
                </button>
                <button onClick={() => handleExport('csv')} className="bg-verde-status text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                    Exportar Planilha
                </button>
            </div>
        </div>
        
        {reportType === 'individual' && selectedAudit && (
            <div className="mt-4 pt-4 border-t flex items-center gap-4">
                <input 
                    type="checkbox" 
                    id="includeRiskMatrix" 
                    checked={includeRiskMatrix} 
                    onChange={(e) => setIncludeRiskMatrix(e.target.checked)}
                    className="h-4 w-4 text-azul-claro border-gray-300 rounded focus:ring-azul-claro"
                />
                <label htmlFor="includeRiskMatrix" className="text-sm font-medium text-gray-700">Incluir Matriz de Riscos no Relatório</label>
            </div>
        )}
      </div>

      <div id="report-content-wrapper" className="mt-8">
        <div id="report-content" className="bg-white p-8 rounded-lg shadow">
            {renderReportContent()}
        </div>
      </div>
      
      {sectionEditorState && selectedAudit && (
          <ReportSectionEditor
              auditId={selectedAudit.id}
              section={sectionEditorState.section}
              onSave={handleSaveSection}
              onClose={() => setSectionEditorState(null)}
              maxSequence={currentCustomSections.reduce((max, s) => Math.max(max, s.sequence), 0)}
          />
      )}
    </div>
  );
};

export default Reports;