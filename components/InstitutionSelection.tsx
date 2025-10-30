import React, { useState } from 'react';
import { Institution, InstitutionType } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface InstitutionSelectionProps {
  institutions: Institution[];
  onSelectInstitution: (institutionId: string) => void;
  onAddInstitution: (municipalityName: string, type: InstitutionType, cnpj: string) => Promise<void>;
  onDeleteInstitution: (institutionId: string) => Promise<void>;
  onLogout: () => void;
}

const InstitutionSelection: React.FC<InstitutionSelectionProps> = ({ institutions, onSelectInstitution, onAddInstitution, onDeleteInstitution, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [newMunicipalityName, setNewMunicipalityName] = useState('');
  const [newType, setNewType] = useState<InstitutionType>(InstitutionType.PREFEITURA);
  const [newCnpj, setNewCnpj] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMunicipalityName.trim() && newCnpj.trim()) {
      try {
        console.log('Submitting institution:', { newMunicipalityName, newType, newCnpj });
        await onAddInstitution(newMunicipalityName, newType, newCnpj);
        console.log('Institution added successfully');
        setNewMunicipalityName('');
        setNewCnpj('');
        setShowForm(false);
      } catch (error) {
        console.error('Error adding institution:', error);
        alert(`Erro ao adicionar instituição: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique o console para mais detalhes.`);
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, institutionId: string) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (window.confirm("Tem certeza que deseja excluir esta instituição? Todos os dados associados (auditorias, achados, etc.) serão perdidos permanentemente.")) {
      try {
        await onDeleteInstitution(institutionId);
      } catch (error) {
        console.error('Error deleting institution:', error);
        // You could add error handling here, like showing a toast notification
      }
    }
  };


  const getInstitutionIcon = (type: InstitutionType) => {
    // Building icon (Prefeitura)
    if (type === InstitutionType.PREFEITURA) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-azul-escuro" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2.25 2.25 0 00-2.25-2.25h-5.25a2.25 2.25 0 00-2.25 2.25v5.25c0 .928.616 1.734 1.5 2.072m10.5-11.25a2.25 2.25 0 00-2.25-2.25h-5.25a2.25 2.25 0 00-2.25 2.25v5.25c0 .928.616 1.734 1.5 2.072m10.5-11.25L10.5 8.572M12 21h8.25" />
        </svg>
      )
    }
    // Users icon (Câmara)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-azul-escuro" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.005.109a12.318 12.318 0 012.372 1.456M12 13.5h0m0 0V9m0 4.5a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75V9m-1.5 4.5a.75.75 0 01-.75.75H9.008a.75.75 0 01-.75-.75V9m1.5 4.5a.75.75 0 00-.75-.75h-.008a.75.75 0 00-.75.75v4.5m1.5-4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v4.5" />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-cinza-claro p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/Logo1.png" alt="Logo" className="w-12 h-12" />
              <div className="text-left">
                <h1 className="text-3xl font-bold text-azul-escuro">GestAudit</h1>
                <p className="mt-1 text-gray-500">Selecione ou cadastre uma instituição</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-vermelho-status text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                Sair
            </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map(inst => (
             <div key={inst.id} className="relative group">
                <button 
                    onClick={() => onSelectInstitution(inst.id)} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left w-full h-full flex flex-col items-center justify-center"
                >
                    <div className="mb-4">
                      {getInstitutionIcon(inst.type)}
                    </div>
                    <h2 className="font-bold text-lg text-azul-escuro text-center">
                        {inst.type === InstitutionType.PREFEITURA ? `Prefeitura de ${inst.municipalityName}` : `${inst.type} de ${inst.municipalityName}`}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{inst.cnpj}</p>
                </button>
                <button
                    onClick={(e) => handleDelete(e, inst.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-500 hover:bg-vermelho-status hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Excluir instituição ${inst.municipalityName}`}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
          ))}
           <button onClick={() => setShowForm(true)} className="bg-white/80 border-2 border-dashed border-gray-400 p-6 rounded-lg shadow-sm hover:shadow-lg hover:border-azul-claro transition-all flex flex-col items-center justify-center text-gray-500 hover:text-azul-claro">
                <PlusIcon className="w-10 h-10" />
                <span className="mt-2 font-semibold">Nova Instituição</span>
            </button>
        </div>
        
        {showForm && (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={() => setShowForm(false)}>
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-azul-escuro mb-4">Cadastrar Nova Instituição</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700">Nome do Município</span>
                                <input type="text" value={newMunicipalityName} onChange={(e) => setNewMunicipalityName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm" />
                            </label>
                             <label className="block">
                                <span className="text-gray-700">Tipo</span>
                                <select value={newType} onChange={(e) => setNewType(e.target.value as InstitutionType)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm">
                                    {Object.values(InstitutionType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </label>
                             <label className="block">
                                <span className="text-gray-700">CNPJ</span>
                                <input type="text" value={newCnpj} onChange={(e) => setNewCnpj(e.target.value)} required placeholder="00.000.000/0001-00" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm" />
                            </label>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default InstitutionSelection;