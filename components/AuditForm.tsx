import React, { useState } from 'react';
import { Audit, AuditType, AuditStatus, Priority } from '../types';
import Modal from './Modal';

interface AuditFormProps {
  audit?: Audit;
  onSave: (audit: Omit<Audit, 'id'> | Audit) => void;
  onClose: () => void;
}

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const textareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const selectClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";


const AuditForm: React.FC<AuditFormProps> = ({ audit, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Audit, 'id' | 'institutionId'>>(audit || {
    year: new Date().getFullYear(),
    auditNumber: '',
    title: '',
    auditedSector: '',
    sectorResponsible: '',
    type: AuditType.OPERATIONAL,
    plannedStartDate: '',
    plannedEndDate: '',
    status: AuditStatus.PLANNED,
    priority: Priority.MEDIUM,
    objective: '',
    scope: '',
    criteria: '',
    auditorNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(audit){
        onSave({ ...audit, ...formData });
    } else {
        // The institutionId will be added in the App component
        onSave(formData as Omit<Audit, 'id'>);
    }
  };

  return (
    <Modal title={audit ? 'Editar Auditoria' : 'Nova Auditoria'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Título / Tema*</span>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Número da Auditoria*</span>
            <input type="text" name="auditNumber" value={formData.auditNumber} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Setor Auditado*</span>
            <input type="text" name="auditedSector" value={formData.auditedSector} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Responsável pelo Setor</span>
            <input type="text" name="sectorResponsible" value={formData.sectorResponsible} onChange={handleChange} className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Ano*</span>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required className={inputClasses} />
          </label>
           <label className="block">
            <span className="text-gray-700">Tipo de Auditoria*</span>
            <select name="type" value={formData.type} onChange={handleChange} required className={selectClasses}>
              {Object.values(AuditType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
           <label className="block">
            <span className="text-gray-700">Data Início Previsto*</span>
            <input type="date" name="plannedStartDate" value={formData.plannedStartDate} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block">
            <span className="text-gray-700">Data Conclusão Previsto*</span>
            <input type="date" name="plannedEndDate" value={formData.plannedEndDate} onChange={handleChange} required className={inputClasses} />
          </label>
           <label className="block">
            <span className="text-gray-700">Prioridade*</span>
            <select name="priority" value={formData.priority} onChange={handleChange} required className={selectClasses}>
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
           <label className="block">
            <span className="text-gray-700">Status*</span>
            <select name="status" value={formData.status} onChange={handleChange} required className={selectClasses}>
              {Object.values(AuditStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
            <span className="text-gray-700">Objetivo</span>
            <textarea name="objective" value={formData.objective} onChange={handleChange} className={textareaClasses}></textarea>
        </label>
        <label className="block">
            <span className="text-gray-700">Escopo</span>
            <textarea name="scope" value={formData.scope} onChange={handleChange} className={textareaClasses}></textarea>
        </label>
        <label className="block">
            <span className="text-gray-700">Critérios</span>
            <textarea name="criteria" value={formData.criteria} onChange={handleChange} className={textareaClasses}></textarea>
        </label>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Auditoria</button>
        </div>
      </form>
    </Modal>
  );
};

export default AuditForm;