import React, { useState } from 'react';
import { AuditStage, AuditStageStatus } from '../types';
import Modal from './Modal';

interface AuditStageFormProps {
  auditId: string;
  stage?: AuditStage;
  onSave: (stage: Omit<AuditStage, 'id'> | AuditStage) => void;
  onClose: () => void;
}

const AuditStageForm: React.FC<AuditStageFormProps> = ({ auditId, stage, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<AuditStage, 'id'>>(stage || {
    auditId: auditId,
    name: '',
    plannedStartDate: '',
    plannedEndDate: '',
    actualStartDate: '',
    actualEndDate: '',
    status: AuditStageStatus.NOT_STARTED,
    responsible: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stage) {
      onSave({ ...stage, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal title={stage ? 'Editar Fase do Plano' : 'Nova Fase do Plano'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="text-gray-700">Nome da Fase*</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Início Planejado*</span>
            <input type="date" name="plannedStartDate" value={formData.plannedStartDate} onChange={handleChange} required className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Fim Planejado*</span>
            <input type="date" name="plannedEndDate" value={formData.plannedEndDate} onChange={handleChange} required className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Início Real</span>
            <input type="date" name="actualStartDate" value={formData.actualStartDate} onChange={handleChange} className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Fim Real</span>
            <input type="date" name="actualEndDate" value={formData.actualEndDate} onChange={handleChange} className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Responsável</span>
            <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} className="form-input" />
          </label>
          <label className="block">
            <span className="text-gray-700">Status*</span>
            <select name="status" value={formData.status} onChange={handleChange} required className="form-select">
              {Object.values(AuditStageStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
            <span className="text-gray-700">Notas / Observações</span>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-textarea" rows={3}></textarea>
        </label>
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Fase</button>
        </div>
      </form>
      {/* FIX: Replaced non-standard <style jsx> with a standard <style> tag to resolve the TypeScript compilation error. */}
      <style>{`
        .form-input, .form-select, .form-textarea {
            display: block;
            width: 100%;
            margin-top: 0.25rem;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid #D1D5DB;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </Modal>
  );
};

export default AuditStageForm;
