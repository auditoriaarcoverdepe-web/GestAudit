import React, { useState, useMemo } from 'react';
import { Risk, Audit, ImpactLevel, ProbabilityLevel, RiskLevel } from '../types';
import { ClipboardListIcon, PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from './Icons';
import RiskForm from './RiskForm';

interface RiskMatrixProps {
  risks: Risk[];
  audits: Audit[];
  onNewRisk: () => void;
  onSaveRisk: (risk: Omit<Risk, 'id' | 'riskLevel'> | Risk) => void;
  onDeleteRisk: (riskId: string) => void;
}

const IMPACT_LEVELS = Object.values(ImpactLevel);
const PROBABILITY_LEVELS = Object.values(ProbabilityLevel);

const calculateRiskLevel = (impact: ImpactLevel, probability: ProbabilityLevel): RiskLevel => {
    const impactMap: Record<ImpactLevel, number> = {
        [ImpactLevel.INSIGNIFICANT]: 1, [ImpactLevel.MINOR]: 2, [ImpactLevel.MODERATE]: 3, [ImpactLevel.SEVERE]: 4, [ImpactLevel.CATASTROPHIC]: 5,
    };
    const probabilityMap: Record<ProbabilityLevel, number> = {
        [ProbabilityLevel.RARE]: 1, [ProbabilityLevel.UNLIKELY]: 2, [ProbabilityLevel.POSSIBLE]: 3, [ProbabilityLevel.PROBABLE]: 4, [ProbabilityLevel.ALMOST_CERTAIN]: 5,
    };
    const score = impactMap[impact] * probabilityMap[probability];
    if (score >= 15) return RiskLevel.EXTREME;
    if (score >= 8) return RiskLevel.HIGH;
    if (score >= 4) return RiskLevel.MODERATE;
    return RiskLevel.LOW;
};

export const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
        case RiskLevel.EXTREME: return 'bg-red-700 text-white';
        case RiskLevel.HIGH: return 'bg-vermelho-status text-white';
        case RiskLevel.MODERATE: return 'bg-amarelo-status text-black';
        case RiskLevel.LOW: return 'bg-verde-status text-white';
        default: return 'bg-gray-400 text-white';
    }
};

const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks, audits, onNewRisk, onSaveRisk, onDeleteRisk }) => {
  const [selectedAuditId, setSelectedAuditId] = useState('');
  const [selectedCell, setSelectedCell] = useState<{ impact: ImpactLevel; probability: ProbabilityLevel } | null>(null);
  const [editingRisk, setEditingRisk] = useState<Risk | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const auditMap = useMemo(() => new Map(audits.map(a => [a.id, a])), [audits]);

  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
        const auditMatch = !selectedAuditId || risk.auditId === selectedAuditId;
        const cellMatch = !selectedCell || (risk.impact === selectedCell.impact && risk.probability === selectedCell.probability);
        return auditMatch && cellMatch;
    });
  }, [risks, selectedAuditId, selectedCell]);

  const matrixData = useMemo(() => {
    const data: { [key in ImpactLevel]?: { [key in ProbabilityLevel]?: number } } = {};
    const risksToCount = selectedAuditId ? risks.filter(r => r.auditId === selectedAuditId) : risks;
    
    IMPACT_LEVELS.forEach(imp => {
      data[imp] = {};
      PROBABILITY_LEVELS.forEach(prob => {
        data[imp]![prob] = 0;
      });
    });

    risksToCount.forEach(risk => {
      if (data[risk.impact] && data[risk.impact]![risk.probability] !== undefined) {
        data[risk.impact]![risk.probability]!++;
      }
    });
    return data;
  }, [risks, selectedAuditId]);

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    setIsFormOpen(true);
  };
  
  const handleSave = (riskData: Omit<Risk, 'id' | 'riskLevel'> | Risk) => {
      onSaveRisk(riskData);
      setIsFormOpen(false);
      setEditingRisk(undefined);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 no-print">
        <div className="flex items-center space-x-2">
          <ClipboardListIcon className="w-8 h-8 text-azul-escuro" />
          <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Matriz de Riscos</h1>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition duration-300">
                <DocumentTextIcon className="w-5 h-5"/>
                Imprimir Matriz
            </button>
            <button onClick={onNewRisk} className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300">
              <PlusIcon />
              Adicionar Risco
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 no-print">
        <label htmlFor="auditFilter" className="block text-sm font-medium text-gray-700">Filtrar por Auditoria</label>
        <select id="auditFilter" value={selectedAuditId} onChange={e => setSelectedAuditId(e.target.value)} className="mt-1 block w-full md:w-1/3 p-2 border rounded-md">
          <option value="">Todas as Auditorias</option>
          {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
        </select>
      </div>
      
      <div id="printable-matrix-area">
        <div className="bg-white p-6 rounded-lg shadow mb-6 overflow-x-auto">
            <div className="hidden print:block text-center mb-4">
                <h1 className="text-2xl font-bold text-black">Matriz de Riscos</h1>
                {selectedAuditId && auditMap.has(selectedAuditId) && (
                    <p className="text-lg">{auditMap.get(selectedAuditId)?.title}</p>
                )}
            </div>
          <table className="w-full min-w-[800px] border-collapse text-center">
              <thead>
                  <tr>
                      <th className="p-2 border font-bold text-sm bg-gray-100" rowSpan={2}>Impacto</th>
                      <th className="p-2 border font-bold text-sm bg-gray-100" colSpan={PROBABILITY_LEVELS.length}>Probabilidade</th>
                  </tr>
                  <tr>
                      {PROBABILITY_LEVELS.map(prob => <th key={prob} className="p-2 border font-semibold text-xs bg-gray-50">{prob}</th>)}
                  </tr>
              </thead>
              <tbody>
                  {IMPACT_LEVELS.slice().reverse().map(impact => (
                      <tr key={impact}>
                          <td className="p-2 border font-semibold text-xs bg-gray-50">{impact}</td>
                          {PROBABILITY_LEVELS.map(probability => {
                              const level = calculateRiskLevel(impact, probability);
                              const count = matrixData[impact]?.[probability] || 0;
                              const isSelected = selectedCell?.impact === impact && selectedCell?.probability === probability;
                              return (
                                  <td 
                                      key={probability} 
                                      onClick={() => setSelectedCell({ impact, probability })}
                                      className={`p-2 border cursor-pointer transition-transform duration-150 ${getRiskLevelColor(level)} ${isSelected ? 'ring-4 ring-blue-400 scale-105 z-10' : 'hover:scale-105'}`}
                                  >
                                      <div className="font-bold text-sm">{level}</div>
                                      {count > 0 && <span className="text-xs font-mono bg-black/20 rounded-full px-1.5 py-0.5 mt-1 inline-block">{count}</span>}
                                  </td>
                              );
                          })}
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>

       <div className="bg-white p-6 rounded-lg shadow no-print">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-azul-escuro">Lista de Riscos</h2>
             {selectedCell && <button onClick={() => setSelectedCell(null)} className="text-sm text-blue-600 hover:underline">Limpar seleção</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Descrição do Risco</th>
                        <th className="p-3">Auditoria</th>
                        <th className="p-3">Impacto</th>
                        <th className="p-3">Probabilidade</th>
                        <th className="p-3">Nível</th>
                        <th className="p-3">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRisks.map(risk => (
                        <tr key={risk.id} className="border-b">
                            <td className="p-3">{risk.description}</td>
                            <td className="p-3 text-gray-600">{auditMap.get(risk.auditId)?.auditNumber}</td>
                            <td className="p-3">{risk.impact}</td>
                            <td className="p-3">{risk.probability}</td>
                            <td className="p-3"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskLevelColor(risk.riskLevel)}`}>{risk.riskLevel}</span></td>
                            <td className="p-3 flex gap-2">
                                <button onClick={() => handleEditRisk(risk)} className="text-azul-claro hover:text-azul-escuro"><PencilIcon /></button>
                                <button onClick={() => onDeleteRisk(risk.id)} className="text-vermelho-status hover:text-red-700"><TrashIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredRisks.length === 0 && <p className="text-center text-gray-500 p-8">Nenhum risco encontrado com os filtros selecionados.</p>}
          </div>
       </div>

        {isFormOpen && (
            <RiskForm
                risk={editingRisk}
                audits={audits}
                onSave={handleSave}
                onClose={() => {setIsFormOpen(false); setEditingRisk(undefined);}}
            />
        )}
    </div>
  );
};

export default RiskMatrix;