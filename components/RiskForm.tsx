import React, { useState } from 'react';
import { Risk, Audit, ImpactLevel, ProbabilityLevel } from '../types';
import Modal from './Modal';

interface RiskFormProps {
  auditId?: string;
  risk?: Risk;
  audits: Audit[];
  onSave: (risk: Omit<Risk, 'id' | 'riskLevel'> | Risk) => void;
  onClose: () => void;
}

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const textareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const selectClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";


const RiskForm: React.FC<RiskFormProps> = ({ auditId, risk, audits, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Risk, 'id' | 'riskLevel'>>(risk || {
    auditId: auditId || '',
    description: '',
    impact: ImpactLevel.MODERATE,
    probability: ProbabilityLevel.POSSIBLE,
    controls: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (risk) {
      onSave({ ...risk, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal title={risk ? 'Editar Risco' : 'Novo Risco'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Auditoria Associada*</span>
          <select 
            name="auditId" 
            value={formData.auditId} 
            onChange={handleChange} 
            required 
            className={selectClasses}
            disabled={!!auditId}
          >
            <option value="" disabled>Selecione uma auditoria</option>
            {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
          </select>
        </label>
        
        <label className="block">
            <span className="text-gray-700">Descrição do Risco*</span>
            <textarea name="description" value={formData.description} onChange={handleChange} required className={textareaClasses} rows={3}></textarea>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Impacto*</span>
            <select name="impact" value={formData.impact} onChange={handleChange} required className={selectClasses}>
              {Object.values(ImpactLevel).map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Probabilidade*</span>
            <select name="probability" value={formData.probability} onChange={handleChange} required className={selectClasses}>
              {Object.values(ProbabilityLevel).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>
        
        <label className="block">
            <span className="text-gray-700">Controles Existentes</span>
            <textarea name="controls" value={formData.controls} onChange={handleChange} className={textareaClasses} rows={3}></textarea>
        </label>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Risco</button>
        </div>
      </form>
    </Modal>
  );
};

export default RiskForm;