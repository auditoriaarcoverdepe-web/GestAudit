import React, { useState, useMemo } from 'react';
import { Finding, Audit, FindingStatus, Priority } from '../types';
import { SearchIcon, DocumentTextIcon, PlusIcon } from './Icons';

interface FindingsListProps {
  findings: Finding[];
  audits: Audit[];
  onSelectAudit: (audit: Audit) => void;
  onNewFinding: () => void;
}

const FindingsList: React.FC<FindingsListProps> = ({ findings, audits, onSelectAudit, onNewFinding }) => {
  const [filters, setFilters] = useState({ status: '', priority: '', auditId: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const auditMap = useMemo(() => new Map(audits.map(audit => [audit.id, audit])), [audits]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const getPriorityColor = (priority: Priority) => {
    switch(priority){
        case Priority.HIGH: return 'text-vermelho-status';
        case Priority.MEDIUM: return 'text-amarelo-status';
        case Priority.LOW: return 'text-verde-status';
    }
  }
  
  const getStatusColor = (status: FindingStatus) => {
    if (status === FindingStatus.RESOLVED) return 'bg-verde-status/20 text-verde-status border border-verde-status';
    if (status === FindingStatus.IN_ANALYSIS) return 'bg-amarelo-status/20 text-amarelo-status border border-amarelo-status';
    return 'bg-vermelho-status/20 text-vermelho-status border border-vermelho-status';
  };


  const filteredFindings = useMemo(() => {
    return findings.filter(finding => {
      const audit = auditMap.get(finding.auditId);
      const searchMatch = searchTerm === '' || 
        finding.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.findingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit?.title.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        (filters.status === '' || finding.status === filters.status) &&
        (filters.priority === '' || finding.classification === filters.priority) &&
        (filters.auditId === '' || finding.auditId === filters.auditId) &&
        searchMatch
      );
    });
  }, [findings, filters, searchTerm, auditMap]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
            <DocumentTextIcon className="w-8 h-8 text-azul-escuro" />
            <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Banco de Achados</h1>
        </div>
        <button onClick={onNewFinding} className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300">
            <PlusIcon />
            Novo Achado
        </button>
      </div>


      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input 
                type="text" 
                placeholder="Buscar por código, resumo ou auditoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border rounded-md w-full"
            />
        </div>
        <select name="auditId" value={filters.auditId} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todas as Auditorias</option>
          {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todas as Prioridades</option>
          {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Status</option>
          {Object.values(FindingStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-azul-escuro text-white">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Resumo</th>
              <th className="p-4">Auditoria</th>
              <th className="p-4">Status</th>
              <th className="p-4">Classificação</th>
            </tr>
          </thead>
          <tbody>
            {filteredFindings.map(finding => {
                const audit = auditMap.get(finding.auditId);
                return (
                    <tr key={finding.id} className="border-b hover:bg-cinza-claro cursor-pointer" onClick={() => audit && onSelectAudit(audit)}>
                        <td className="p-4 font-medium">{finding.findingCode}</td>
                        <td className="p-4">{finding.summary}</td>
                        <td className="p-4 text-gray-700">{audit?.auditNumber}</td>
                        <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(finding.status)}`}>
                            {finding.status}
                        </span>
                        </td>
                        <td className="p-4 font-bold">
                            <span className={getPriorityColor(finding.classification)}>{finding.classification}</span>
                        </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
         {filteredFindings.length === 0 && (
            <div className="text-center p-8 text-gray-500">Nenhum achado encontrado com os filtros selecionados.</div>
        )}
      </div>
    </div>
  );
};

export default FindingsList;