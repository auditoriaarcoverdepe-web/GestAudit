import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CustomReportSection } from '../types'; // Importando o tipo global

export interface ReportSectionEditorProps {
  auditId: string; // Novo prop obrigatório
  section?: CustomReportSection;
  existingSections: CustomReportSection[]; // Changed from maxSequence to existingSections
  onSave: (section: Omit<CustomReportSection, 'id'> | CustomReportSection) => void;
  onClose: () => void;
}

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const textareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";


const ReportSectionEditor: React.FC<ReportSectionEditorProps> = ({ auditId, section, onSave, onClose, existingSections }) => {
  const [isAttachment, setIsAttachment] = useState(section ? section.sequence >= 2000 : false);

  const getNextSequence = (isAtt: boolean) => {
    if (isAtt) {
      const max = existingSections.filter(s => s.sequence >= 2000).reduce((acc, curr) => Math.max(acc, curr.sequence), 1999);
      return max + 1;
    } else {
      const max = existingSections.filter(s => s.sequence < 2000).reduce((acc, curr) => Math.max(acc, curr.sequence), 0);
      return max + 1;
    }
  };

  const [formData, setFormData] = useState<Omit<CustomReportSection, 'id' | 'auditId'>>(section || {
    title: '',
    content: '',
    sequence: getNextSequence(false),
  });

  useEffect(() => {
    if (section) {
      // Ao editar, carregamos os dados existentes, excluindo o auditId e id
      const { id, auditId, ...rest } = section;
      setFormData(rest);
      setIsAttachment(section.sequence >= 2000);
    } else {
      // Recalculate sequence when isAttachment changes for new sections
      setFormData(prev => ({ ...prev, sequence: getNextSequence(isAttachment) }));
    }
  }, [section, isAttachment]); // Added isAttachment dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sequence' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave = { ...formData, auditId };

    if (section) {
      // Update existing section
      await onSave({ ...section, ...dataToSave });
    } else {
      // New section
      await onSave(dataToSave as Omit<CustomReportSection, 'id'>);
    }
  };

  return (
    <Modal title={section ? 'Editar Seção do Relatório' : 'Nova Seção do Relatório'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAttachment}
            onChange={(e) => setIsAttachment(e.target.checked)}
            className="h-4 w-4 text-azul-claro border-gray-300 rounded focus:ring-azul-claro"
          />
          <span className="text-gray-700 font-medium">Este item é um anexo?</span>
        </label>

        <label className="block">
          <span className="text-gray-700">Título da Seção*</span>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} />
        </label>
        <label className="block">
          <span className="text-gray-700">Conteúdo*</span>
          <textarea name="content" value={formData.content} onChange={handleChange} required className={textareaClasses} rows={8}></textarea>
        </label>
        <label className="block">
          <span className="text-gray-700">Sequência (Ordem de Exibição)*</span>
          <input type="number" name="sequence" value={formData.sequence} onChange={handleChange} required className={inputClasses} min="1" />
          <p className="text-xs text-gray-500 mt-1">Anexos devem ter sequência a partir de 2000.</p>
        </label>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Seção</button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportSectionEditor;