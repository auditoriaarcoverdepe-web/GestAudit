import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Audit, Recommendation, AuditStatus, RecommendationStatus, Finding } from '../types';
import { HomeIcon, ExclamationTriangleIcon } from './Icons';

interface DashboardProps {
  audits: Audit[];
  findings: Finding[];
  recommendations: Recommendation[];
}

const COLORS = {
  [AuditStatus.PLANNED]: '#3B82F6',
  [AuditStatus.IN_PROGRESS]: '#F59E0B',
  [AuditStatus.COMPLETED]: '#10B981',
  [AuditStatus.POSTPONED]: '#6B7280',
};

const REC_COLORS = {
    [RecommendationStatus.PENDING]: '#EF4444',
    [RecommendationStatus.IN_PROGRESS]: '#F59E0B',
    [RecommendationStatus.COMPLETED]: '#3B82F6',
    [RecommendationStatus.VERIFIED]: '#10B981',
};

const StatCard: React.FC<{ title: string; value: number | string; bgColor: string }> = ({ title, value, bgColor }) => (
  <div className={`p-4 rounded-lg shadow-md text-white ${bgColor}`}>
    <h3 className="text-sm font-medium uppercase">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ audits, findings, recommendations }) => {
  
  // Calculate stats based on all data provided (already filtered by institution in App.tsx)
  const totalAudits = audits.length;
  const totalFindings = findings.length;
  const pendingRecommendations = recommendations.filter(r => r.status === RecommendationStatus.PENDING).length;

  const auditStatusData = Object.values(AuditStatus)
    .filter(s => [AuditStatus.PLANNED, AuditStatus.IN_PROGRESS, AuditStatus.COMPLETED, AuditStatus.POSTPONED].includes(s))
    .map(status => ({
        name: status,
        value: audits.filter(a => a.status === status).length,
    })).filter(d => d.value > 0);

  const recommendationStatusData = Object.values(RecommendationStatus)
    .map(status => ({
        name: status,
        value: recommendations.filter(r => r.status === status).length,
    })).filter(d => d.value > 0);

  const upcomingAudits = audits
    .filter(a => a.status === AuditStatus.PLANNED && new Date(a.plannedStartDate) > new Date())
    .sort((a, b) => new Date(a.plannedStartDate).getTime() - new Date(b.plannedStartDate).getTime())
    .slice(0, 5);

  const recommendationsNearDeadline = recommendations
    .filter(r => {
        const deadline = new Date(r.deadline);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        return r.status !== RecommendationStatus.COMPLETED && r.status !== RecommendationStatus.VERIFIED && deadline > today && deadline <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center space-x-2">
        <HomeIcon className="w-8 h-8 text-azul-escuro" />
        <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Painel de Controle</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={`Total de Auditorias`} value={totalAudits} bgColor="bg-azul-claro" />
        <StatCard title={`Total de Achados`} value={totalFindings} bgColor="bg-azul-escuro" />
        <StatCard title={`Recom. Pendentes`} value={pendingRecommendations} bgColor="bg-vermelho-status" />
        <StatCard title="Planejadas" value={auditStatusData.find(d => d.name === AuditStatus.PLANNED)?.value || 0} bgColor="bg-gray-500" />
        <StatCard title="Em Andamento" value={auditStatusData.find(d => d.name === AuditStatus.IN_PROGRESS)?.value || 0} bgColor="bg-amarelo-status" />
        <StatCard title="Concluídas" value={auditStatusData.find(d => d.name === AuditStatus.COMPLETED)?.value || 0} bgColor="bg-verde-status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-azul-escuro mb-4">Auditorias por Status (Geral)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={auditStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {auditStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-azul-escuro mb-4">Recomendações por Situação</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recommendationStatusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {recommendationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={REC_COLORS[entry.name as keyof typeof REC_COLORS]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-azul-escuro mb-4">Próximas Auditorias</h2>
          <ul className="space-y-3">
            {upcomingAudits.length > 0 ? (
              upcomingAudits.map(audit => (
                <li key={audit.id} className="p-3 bg-cinza-claro rounded-md">
                  <p className="font-semibold">{audit.title}</p>
                  <p className="text-sm text-gray-600">Início: {new Date(audit.plannedStartDate).toLocaleDateString('pt-BR')}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma auditoria planejada encontrada.</p>
            )}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-vermelho-status"/>
            <h2 className="text-lg font-semibold text-azul-escuro">Recomendações com Prazo Próximo</h2>
          </div>
          <ul className="space-y-3">
            {recommendationsNearDeadline.length > 0 ? (
              recommendationsNearDeadline.map(rec => (
                <li key={rec.id} className="p-3 bg-red-100 border-l-4 border-vermelho-status rounded-md">
                  <p className="font-semibold">{rec.description.substring(0, 50)}...</p>
                  <p className="text-sm text-gray-600">Prazo: <span className="font-bold">{new Date(rec.deadline).toLocaleDateString('pt-BR')}</span></p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma recomendação com prazo próximo.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;