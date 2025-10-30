import React, { useState, useEffect } from 'react';
import { AuditorProfile } from '../types';
import { CogIcon } from './Icons';

interface SettingsProps {
  profile: AuditorProfile;
  onProfileChange: (profile: AuditorProfile) => void;
  onExportData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onProfileChange, onExportData }) => {
  const [formData, setFormData] = useState<AuditorProfile>(profile);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileChange(formData);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleBackup = () => {
    alert("Funcionalidade de Backup no Google Drive não implementada nesta versão. Exporte seus dados como alternativa.");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center space-x-2 mb-6">
        <CogIcon className="w-8 h-8 text-azul-escuro" />
        <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Configurações Pessoais</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Auditor Profile */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-azul-escuro mb-4">Perfil do Auditor</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700">Assinatura (Texto)</label>
                <input
                  type="text"
                  name="signature"
                  id="signature"
                  value={formData.signature}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
                <button 
                    type="submit" 
                    className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg hover:bg-azul-escuro transition duration-300"
                >
                    Salvar Alterações
                </button>
                {showConfirmation && <span className="text-verde-status font-semibold animate-pulse">Perfil salvo com sucesso!</span>}
            </div>
          </form>
        </div>

        {/* Data Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-azul-escuro mb-4">Gerenciamento de Dados</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Backup</h3>
              <p className="text-sm text-gray-600 mt-1">
                Salve uma cópia de segurança de todos os seus dados no Google Drive.
              </p>
              <button
                onClick={handleBackup}
                className="mt-2 w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Definir Local de Backup (Google Drive)
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Exportação</h3>
              <p className="text-sm text-gray-600 mt-1">
                Exporte todos os seus dados de auditorias, achados e recomendações para um arquivo JSON.
              </p>
              <button
                onClick={onExportData}
                className="mt-2 w-full bg-azul-claro text-white font-bold py-2 px-4 rounded-lg hover:bg-azul-escuro transition duration-300"
              >
                Exportar Todos os Dados (.json)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
