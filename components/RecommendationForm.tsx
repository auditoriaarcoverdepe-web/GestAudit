import React, { useState, useMemo } from 'react';
import { Recommendation, RecommendationStatus, Finding, Audit } from '../types';
import Modal from './Modal';

interface RecommendationFormProps {
  findingId?: string;
  recommendation?: Recommendation;
  findings: Finding[];
  audits: Audit[];
  onSave: (rec: Omit<Recommendation, 'id'> | Recommendation) => void;
  onClose: () => void;
}

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const textareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const selectClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";


const RecommendationForm: React.FC<RecommendationFormProps> = ({ findingId, recommendation, findings, audits, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Recommendation, 'id'>>(recommendation || {
    findingId: findingId || '',
    recommendationCode: '',
    description: '',
    implementationResponsible: '',
    deadline: '',
    status: RecommendationStatus.PENDING,
  });

  const findingOptions = useMemo(() => {
    const auditMap = new Map(audits.map(a => [a.id, a]));
    return findings.map(f => ({
        ...f,
        audit: auditMap.get(f.auditId)
    }));
  }, [findings, audits]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recommendation) {
      onSave({ ...recommendation, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal title={recommendation ? 'Editar Recomendação' : 'Nova Recomendação'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
         {!findingId && (
            <label className="block">
                <span className="text-gray-700">Achado Vinculado*</span>
                <select name="findingId" value={formData.findingId} onChange={handleChange} required className={selectClasses}>
                    <option value="" disabled>Selecione um achado</option>
                    {findingOptions.map(f => (
                        <option key={f.id} value={f.id}>
                            {`[${f.audit?.auditNumber || 'N/A'}] ${f.findingCode} - ${f.summary.substring(0, 50)}...`}
                        </option>
                    ))}
                </select>
            </label>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Código da Recomendação*</span>
            <input type="text" name="recommendationCode" value={formData.recommendationCode} onChange={handleChange} required className={inputClasses} />
          </label>
           <label className="block">
            <span className="text-gray-700">Responsável pela Implementação*</span>
            <input type="text" name="implementationResponsible" value={formData.implementationResponsible} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Prazo*</span>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Status*</span>
            <select name="status" value={formData.status} onChange={handleChange} required className={selectClasses}>
              {Object.values(RecommendationStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
            <span className="text-gray-700">Descrição Detalhada*</span>
            <textarea name="description" value={formData.description} onChange={handleChange} required className={textareaClasses} rows={4}></textarea>
        </label>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Recomendação</button>
        </div>
      </form>
    </Modal>
  );
};

export default RecommendationForm;