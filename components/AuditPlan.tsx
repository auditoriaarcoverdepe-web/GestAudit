import React, { useState, useMemo } from 'react';
import { Audit, AuditStatus, AuditType, Priority } from '../types';
import { CalendarIcon, PlusIcon } from './Icons';

interface AuditPlanProps {
  audits: Audit[];
  onSelectAudit: (audit: Audit) => void;
  onNewAudit: () => void;
}

export const getStatusColor = (status: AuditStatus) => {
  switch (status) {
    case AuditStatus.COMPLETED:
    case AuditStatus.CLOSED:
    case AuditStatus.REPORT_ISSUED:
      return 'bg-verde-status/20 text-verde-status border border-verde-status';
    case AuditStatus.IN_PROGRESS:
    case AuditStatus.IN_ANALYSIS:
      return 'bg-amarelo-status/20 text-amarelo-status border border-amarelo-status';
    case AuditStatus.PLANNED:
      return 'bg-azul-claro/20 text-azul-claro border border-azul-claro';
    default:
      return 'bg-gray-400/20 text-gray-600 border border-gray-400';
  }
};

export const getPriorityColor = (priority: Priority) => {
    switch(priority){
        case Priority.HIGH: return 'text-vermelho-status';
        case Priority.MEDIUM: return 'text-amarelo-status';
        case Priority.LOW: return 'text-verde-status';
    }
}

const AuditPlan: React.FC<AuditPlanProps> = ({ audits, onSelectAudit, onNewAudit }) => {
  const [filters, setFilters] = useState({ year: '', type: '', status: '' });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Audit; direction: 'asc' | 'desc' } | null>({key: 'plannedStartDate', direction: 'asc'});

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const sortedAudits = useMemo(() => {
    let sortableItems = [...audits];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === undefined || valA < valB!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valB === undefined || valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [audits, sortConfig]);

  const filteredAudits = useMemo(() => {
    return sortedAudits.filter(audit => {
      return (
        (filters.year === '' || audit.year.toString() === filters.year) &&
        (filters.type === '' || audit.type === filters.type) &&
        (filters.status === '' || audit.status === filters.status)
      );
    });
  }, [sortedAudits, filters]);
  
  const years = [...new Set(audits.map(a => a.year))].sort((a,b) => Number(b)-Number(a));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
            <CalendarIcon className="w-8 h-8 text-azul-escuro" />
            <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Plano de Auditorias</h1>
        </div>
        <button onClick={onNewAudit} className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300">
            <PlusIcon />
            Nova Auditoria
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <select name="year" value={filters.year} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Anos</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Tipos</option>
          {Object.values(AuditType).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md">
          <option value="">Todos os Status</option>
          {Object.values(AuditStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-azul-escuro text-white">
            <tr>
              <th className="p-4">Número</th>
              <th className="p-4">Título / Tema</th>
              <th className="p-4">Setor Auditado</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Início Previsto</th>
              <th className="p-4">Status</th>
              <th className="p-4">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map(audit => (
              <tr key={audit.id} className="border-b hover:bg-cinza-claro cursor-pointer" onClick={() => onSelectAudit(audit)}>
                <td className="p-4 font-medium">{audit.auditNumber}</td>
                <td className="p-4">{audit.title}</td>
                <td className="p-4 text-gray-700">{audit.auditedSector}</td>
                <td className="p-4 text-gray-700">{audit.type}</td>
                <td className="p-4 text-gray-700">{new Date(audit.plannedStartDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(audit.status)}`}>
                    {audit.status}
                  </span>
                </td>
                <td className="p-4 font-bold">
                    <span className={getPriorityColor(audit.priority)}>{audit.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredAudits.length === 0 && (
            <div className="text-center p-8 text-gray-500">Nenhuma auditoria encontrada com os filtros selecionados.</div>
        )}
      </div>
    </div>
  );
};

export default AuditPlan;