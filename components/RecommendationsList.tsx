import React, { useState, useMemo } from 'react';
import { Recommendation, Finding, Audit, RecommendationStatus } from '../types';
import { SearchIcon, DocumentTextIcon, PlusIcon } from './Icons';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  findings: Finding[];
  audits: Audit[];
  onSelectAudit: (audit: Audit) => void;
  onNewRecommendation: () => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations, findings, audits, onSelectAudit, onNewRecommendation }) => {
  const [filters, setFilters] = useState({ status: '', auditId: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const findingMap = useMemo(() => new Map(findings.map(f => [f.id, f])), [findings]);
  const auditMap = useMemo(() => new Map(audits.map(a => [a.id, a])), [audits]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status: RecommendationStatus) => {
    switch (status) {
      case RecommendationStatus.VERIFIED:
      case RecommendationStatus.COMPLETED:
        return 'bg-verde-status/20 text-verde-status border border-verde-status';
      case RecommendationStatus.IN_PROGRESS:
        return 'bg-amarelo-status/20 text-amarelo-status border border-amarelo-status';
      case RecommendationStatus.PENDING:
        return 'bg-vermelho-status/20 text-vermelho-status border border-vermelho-status';
      default:
        return 'bg-gray-400/20 text-gray-600 border border-gray-400';
    }
  };

  const filteredRecs = useMemo(() => {
    return recommendations.filter(rec => {
      const finding = findingMap.get(rec.findingId);
      if (!finding) return false;
      const audit = auditMap.get(finding.auditId);
      if(!audit) return false;

      const searchMatch = searchTerm === '' ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.recommendationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return (
        (filters.status === '' || rec.status === filters.status) &&
        (filters.auditId === '' || finding.auditId === filters.auditId) &&
        searchMatch
      );
    });
  }, [recommendations, filters, searchTerm, findingMap, auditMap]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="w-8 h-8 text-azul-escuro" />
          <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Plano de Ação</h1>
        </div>
        <button onClick={onNewRecommendation} className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300">
            <PlusIcon />
            Nova Recomendação
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input 
                type="text" 
                placeholder="Buscar por código, descrição ou auditoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border rounded-md w-full"
            />
        </div>
        <select name="auditId" value={filters.auditId} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todas as Auditorias</option>
          {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Status</option>
          {Object.values(RecommendationStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-azul-escuro text-white">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Auditoria</th>
              <th className="p-4">Prazo</th>
              <th className="p-4">Status</th>
              <th className="p-4">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecs.map(rec => {
              const finding = findingMap.get(rec.findingId);
              const audit = finding ? auditMap.get(finding.auditId) : null;
              return (
                <tr key={rec.id} className="border-b hover:bg-cinza-claro cursor-pointer" onClick={() => audit && onSelectAudit(audit)}>
                  <td className="p-4 font-medium">{rec.recommendationCode}</td>
                  <td className="p-4">{rec.description}</td>
                  <td className="p-4 text-gray-700">{audit?.auditNumber}</td>
                  <td className="p-4 text-gray-700">{new Date(rec.deadline).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{rec.implementationResponsible}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRecs.length === 0 && (
          <div className="text-center p-8 text-gray-500">Nenhuma recomendação encontrada com os filtros selecionados.</div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsList;