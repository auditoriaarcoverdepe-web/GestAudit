import React, { useMemo } from 'react';
import { Risk, ImpactLevel, ProbabilityLevel, RiskLevel } from '../types';
import { getRiskLevelColor } from './RiskMatrix';

interface RiskMatrixSectionProps {
  risks: Risk[];
}

const IMPACT_LEVELS = Object.values(ImpactLevel);
const PROBABILITY_LEVELS = Object.values(ProbabilityLevel);

// Replicando a lógica de cálculo de risco para garantir que a seção seja auto-suficiente
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

const RiskMatrixSection: React.FC<RiskMatrixSectionProps> = ({ risks }) => {
  
  const matrixData = useMemo(() => {
    const data: { [key in ImpactLevel]?: { [key in ProbabilityLevel]?: number } } = {};
    
    IMPACT_LEVELS.forEach(imp => {
      data[imp] = {};
      PROBABILITY_LEVELS.forEach(prob => {
        data[imp]![prob] = 0;
      });
    });

    risks.forEach(risk => {
      if (data[risk.impact] && data[risk.impact]![risk.probability] !== undefined) {
        data[risk.impact]![risk.probability]!++;
      }
    });
    return data;
  }, [risks]);

  const highPriorityRisks = risks.filter(r =>
    r.riskLevel === RiskLevel.EXTREME || r.riskLevel === RiskLevel.HIGH
  ).sort((a, b) => {
    const levelOrder = { [RiskLevel.EXTREME]: 1, [RiskLevel.HIGH]: 2, [RiskLevel.MODERATE]: 3, [RiskLevel.LOW]: 4 };
    return levelOrder[a.riskLevel] - levelOrder[b.riskLevel];
  });

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Matriz de Avaliação de Riscos</h4>
      
      {/* Risk Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-center text-xs">
            <thead>
                <tr>
                    <th className="p-2 border font-bold bg-gray-100" rowSpan={2}>Impacto</th>
                    <th className="p-2 border font-bold bg-gray-100" colSpan={PROBABILITY_LEVELS.length}>Probabilidade</th>
                </tr>
                <tr>
                    {PROBABILITY_LEVELS.map(prob => <th key={prob} className="p-2 border font-semibold bg-gray-50">{prob}</th>)}
                </tr>
            </thead>
            <tbody>
                {IMPACT_LEVELS.slice().reverse().map(impact => (
                    <tr key={impact}>
                        <td className="p-2 border font-semibold bg-gray-50">{impact}</td>
                        {PROBABILITY_LEVELS.map(probability => {
                            const level = calculateRiskLevel(impact, probability);
                            const count = matrixData[impact]?.[probability] || 0;
                            return (
                                <td 
                                    key={probability} 
                                    className={`p-2 border ${getRiskLevelColor(level)}`}
                                >
                                    <div className="font-bold">{level}</div>
                                    {count > 0 && <span className="text-xs font-mono bg-black/20 rounded-full px-1 py-0.5 mt-1 inline-block">{count}</span>}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* High Priority Risks List */}
      <h4 className="text-lg font-semibold text-gray-800 pt-4 border-t">Riscos de Prioridade Alta e Extrema</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">Descrição do Risco</th>
                    <th className="p-2">Nível</th>
                    <th className="p-2">Controles Existentes</th>
                </tr>
            </thead>
            <tbody>
                {highPriorityRisks.length > 0 ? highPriorityRisks.map(risk => (
                    <tr key={risk.id} className="border-b">
                        <td className="p-2 text-justify">{risk.description}</td>
                        <td className="p-2">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getRiskLevelColor(risk.riskLevel)}`}>
                                {risk.riskLevel}
                            </span>
                        </td>
                        <td className="p-2 text-gray-600 text-justify">{risk.controls}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={3} className="text-center p-4 text-gray-500">Nenhum risco de alta prioridade identificado.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskMatrixSection;