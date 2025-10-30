import React, { useState } from 'react';
import { Audit, Finding, Recommendation, FindingStatus, Priority, AuditStatus, AuditStage, AuditStageStatus, Risk } from '../types';
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusCircleIcon, ClipboardListIcon, ExclamationTriangleIcon } from './Icons';
import { getStatusColor, getPriorityColor } from './AuditPlan';
import FindingForm from './FindingForm';
import AuditStageForm from './AuditStageForm';
import RiskForm from './RiskForm'; // Import RiskForm
import { getRiskLevelColor } from './RiskMatrix'; // Import color helper

interface AuditDetailProps {
  audit: Audit;
  findings: Finding[];
  recommendations: Recommendation[];
  auditStages: AuditStage[];
  risks: Risk[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNewFinding: () => void;
  onSaveFinding: (finding: Omit<Finding, 'id'> | Finding) => void;
  onDeleteFinding: (findingId: string) => void;
  onSaveRecommendation: (recommendation: Omit<Recommendation, 'id'> | Recommendation) => void;
  onDeleteRecommendation: (recommendationId: string) => void;
  onSaveAuditStage: (stage: Omit<AuditStage, 'id'> | AuditStage) => void;
  onDeleteAuditStage: (stageId: string) => void;
  onSaveRisk: (risk: Omit<Risk, 'id' | 'riskLevel'> | Risk) => void; // Add risk handlers
  onDeleteRisk: (riskId: string) => void;
}

const getFindingStatusColor = (status: FindingStatus) => {
    if (status === FindingStatus.RESOLVED) return 'bg-verde-status/20 text-verde-status';
    if (status === FindingStatus.IN_ANALYSIS) return 'bg-amarelo-status/20 text-amarelo-status';
    return 'bg-vermelho-status/20 text-vermelho-status';
};

const getStageStatusColor = (status: AuditStageStatus) => {
    switch(status) {
        case AuditStageStatus.COMPLETED: return 'bg-verde-status/20 text-verde-status';
        case AuditStageStatus.IN_PROGRESS: return 'bg-amarelo-status/20 text-amarelo-status';
        case AuditStageStatus.DELAYED: return 'bg-vermelho-status/20 text-vermelho-status';
        case AuditStageStatus.NOT_STARTED:
        default:
            return 'bg-gray-400/20 text-gray-600';
    }
}

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';

const AuditDetail: React.FC<AuditDetailProps> = (props) => {
  const {
    audit,
    findings,
    recommendations,
    auditStages,
    risks,
    onBack,
    onEdit,
    onDelete,
    onNewFinding,
    onSaveFinding,
    onDeleteFinding,
    onSaveRecommendation,
    onDeleteRecommendation,
    onSaveAuditStage,
    onDeleteAuditStage,
    onSaveRisk,
    onDeleteRisk,
  } = props;
  
  const [findingModalState, setFindingModalState] = useState<{type: 'newFinding' | 'editFinding', finding?: Finding} | null>(null);
  const [stageModalState, setStageModalState] = useState<{type: 'newStage' | 'editStage', stage?: AuditStage} | null>(null);
  const [riskModalState, setRiskModalState] = useState<{ type: 'newRisk' | 'editRisk', risk?: Risk } | null>(null);

  
  const InfoCard: React.FC<{label: string, value?: string, children?: React.ReactNode, fullWidth?: boolean}> = ({ label, value, children, fullWidth }) => (
    <div className={fullWidth ? 'col-span-1 md:col-span-2' : ''}>
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        {value ? <p className="mt-1 text-gray-800">{value}</p> : children}
    </div>
  );

  const handleSaveFinding = (finding: Omit<Finding, 'id'> | Finding) => {
    onSaveFinding(finding);
    setFindingModalState(null);
  }
  
  const handleSaveStage = (stage: Omit<AuditStage, 'id'> | AuditStage) => {
    onSaveAuditStage(stage);
    setStageModalState(null);
  }

  const handleSaveRisk = (risk: Omit<Risk, 'id' | 'riskLevel'> | Risk) => {
    onSaveRisk(risk);
    setRiskModalState(null);
  }

  const isAuditClosed = [AuditStatus.COMPLETED, AuditStatus.CLOSED, AuditStatus.REPORT_ISSUED].includes(audit.status);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-azul-claro hover:text-azul-escuro font-semibold">
                <ArrowLeftIcon /> Voltar para o Plano de Auditorias
            </button>
            <div className="flex gap-2">
                <button onClick={onEdit} className="flex items-center gap-2 bg-amarelo-status text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition duration-300">
                    <PencilIcon /> Editar
                </button>
                <button onClick={onDelete} className="flex items-center gap-2 bg-vermelho-status text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-300">
                    <TrashIcon /> Excluir
                </button>
            </div>
        </div>

        {/* Audit Identification */}
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{audit.auditNumber} - {audit.year}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro mt-1">{audit.title}</h1>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${getStatusColor(audit.status)}`}>
                        {audit.status}
                    </span>
                    <p className={`mt-2 font-bold text-lg ${getPriorityColor(audit.priority)}`}>{audit.priority}</p>
                </div>
            </div>
            <hr className="my-4"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard label="Setor Auditado" value={audit.auditedSector} />
                <InfoCard label="Responsável pelo Setor" value={audit.sectorResponsible} />
                <InfoCard label="Tipo de Auditoria" value={audit.type} />
                <InfoCard label="Datas Previstas" value={`${formatDate(audit.plannedStartDate)} a ${formatDate(audit.plannedEndDate)}`} />
                <InfoCard label="Objetivo da Auditoria" value={audit.objective} fullWidth />
                <InfoCard label="Escopo" value={audit.scope} fullWidth />
                <InfoCard label="Critérios e Normas Aplicáveis" value={audit.criteria} fullWidth />
            </div>
        </div>

        {/* Work Plan Section */}
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <ClipboardListIcon className="w-7 h-7 text-azul-escuro"/>
                    <h2 className="text-xl font-bold text-azul-escuro">Plano de Trabalho</h2>
                </div>
                <button 
                    onClick={() => setStageModalState({ type: 'newStage' })}
                    disabled={isAuditClosed}
                    className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={isAuditClosed ? "Não é possível adicionar fases a uma auditoria concluída." : "Adicionar nova fase"}
                 >
                    <PlusCircleIcon className="w-5 h-5"/>
                    Adicionar Fase
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Fase</th>
                            <th className="p-3">Responsável</th>
                            <th className="p-3">Período Planejado</th>
                            <th className="p-3">Período Real</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditStages.length > 0 ? auditStages.map(stage => (
                            <tr key={stage.id} className="border-b">
                                <td className="p-3 font-semibold">{stage.name}</td>
                                <td className="p-3">{stage.responsible || 'N/A'}</td>
                                <td className="p-3">{formatDate(stage.plannedStartDate)} - {formatDate(stage.plannedEndDate)}</td>
                                <td className="p-3">{formatDate(stage.actualStartDate)} - {formatDate(stage.actualEndDate)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageStatusColor(stage.status)}`}>
                                        {stage.status}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => setStageModalState({type: 'editStage', stage: stage})} className="text-azul-claro hover:text-azul-escuro"><PencilIcon /></button>
                                    <button onClick={() => onDeleteAuditStage(stage.id)} className="text-vermelho-status hover:text-red-700"><TrashIcon /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center p-8 text-gray-500">Nenhuma fase planejada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

         {/* Risks Section */}
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-7 h-7 text-azul-escuro"/>
                    <h2 className="text-xl font-bold text-azul-escuro">Riscos Identificados</h2>
                </div>
                 <button 
                    onClick={() => setRiskModalState({ type: 'newRisk' })}
                    disabled={isAuditClosed}
                    className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={isAuditClosed ? "Não é possível adicionar riscos a uma auditoria concluída." : "Adicionar novo risco"}
                 >
                    <PlusCircleIcon />
                    Adicionar Risco
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 font-semibold">Descrição do Risco</th>
                            <th className="p-3 font-semibold">Controles Existentes</th>
                            <th className="p-3 font-semibold text-center">Nível de Risco</th>
                            <th className="p-3 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {risks.length > 0 ? risks.map(risk => (
                            <tr key={risk.id} className="border-b hover:bg-cinza-claro">
                                <td className="p-3 align-top">{risk.description}</td>
                                <td className="p-3 align-top text-gray-600">{risk.controls}</td>
                                <td className="p-3 text-center align-top">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskLevelColor(risk.riskLevel)}`}>
                                        {risk.riskLevel}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2 items-start">
                                    <button onClick={() => setRiskModalState({ type: 'editRisk', risk: risk })} className="text-azul-claro hover:text-azul-escuro" title="Editar Risco">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => onDeleteRisk(risk.id)} className="text-vermelho-status hover:text-red-700" title="Excluir Risco">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center p-8 text-gray-500">
                                    Nenhum risco registrado para esta auditoria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>


        {/* Findings Section */}
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-azul-escuro">Achados de Auditoria</h2>
                 <button 
                    onClick={onNewFinding} 
                    disabled={isAuditClosed}
                    className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={isAuditClosed ? "Não é possível adicionar achados a uma auditoria concluída." : "Adicionar novo achado"}
                 >
                    <PlusCircleIcon />
                    Novo Achado
                </button>
            </div>
            <div className="space-y-4">
                {findings.length > 0 ? findings.map(finding => (
                    <div key={finding.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-800">{finding.findingCode}: {finding.summary}</h3>
                                <p className="text-sm text-gray-600 mt-1">{finding.violatedCriteria}</p>
                            </div>
                            <div className="text-right ml-4 flex-shrink-0">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getFindingStatusColor(finding.status)}`}>
                                    {finding.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                           <button onClick={() => setFindingModalState({ type: 'editFinding', finding: finding })} className="text-sm text-azul-claro hover:underline">Detalhes / Editar</button>
                           <button onClick={() => onDeleteFinding(finding.id)} className="text-sm text-vermelho-status hover:underline">Excluir</button>
                        </div>
                    </div>
                )) : <p className="text-gray-500">Nenhum achado registrado para esta auditoria.</p>}
            </div>
        </div>

        {findingModalState && (
            <FindingForm
                auditId={audit.id}
                finding={findingModalState.type === 'editFinding' ? findingModalState.finding : undefined}
                audits={[audit]}
                recommendations={findingModalState.finding ? recommendations.filter(r => r.findingId === findingModalState.finding?.id) : []}
                onSaveFinding={handleSaveFinding}
                onClose={() => setFindingModalState(null)}
                onSaveRecommendation={onSaveRecommendation}
                onDeleteRecommendation={onDeleteRecommendation}
            />
        )}

        {stageModalState && (
            <AuditStageForm
                auditId={audit.id}
                stage={stageModalState.type === 'editStage' ? stageModalState.stage : undefined}
                onSave={handleSaveStage}
                onClose={() => setStageModalState(null)}
            />
        )}

        {riskModalState && (
            <RiskForm
                auditId={audit.id}
                risk={riskModalState.type === 'editRisk' ? riskModalState.risk : undefined}
                audits={[audit]}
                onSave={handleSaveRisk}
                onClose={() => setRiskModalState(null)}
            />
        )}
    </div>
  );
};

export default AuditDetail;