import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export interface CustomReportSection {
  id: string;
  title: string;
  content: string;
  sequence: number;
}

interface ReportSectionEditorProps {
  section?: CustomReportSection;
  onSave: (section: Omit<CustomReportSection, 'id'> | CustomReportSection) => void;
  onClose: () => void;
  maxSequence: number;
}

const ReportSectionEditor: React.FC<ReportSectionEditorProps> = ({ section, onSave, onClose, maxSequence }) => {
  const [formData, setFormData] = useState<Omit<CustomReportSection, 'id'>>(section || {
    title: '',
    content: '',
    sequence: maxSequence + 1,
  });

  useEffect(() => {
    if (section) {
      setFormData(section);
    }
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sequence' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (section) {
      onSave({ ...section, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal title={section ? 'Editar Seção do Relatório' : 'Nova Seção do Relatório'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Título da Seção*</span>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
        </label>
        <label className="block">
          <span className="text-gray-700">Conteúdo*</span>
          <textarea name="content" value={formData.content} onChange={handleChange} required className="form-textarea" rows={8}></textarea>
        </label>
        <label className="block">
          <span className="text-gray-700">Sequência (Ordem de Exibição)*</span>
          <input type="number" name="sequence" value={formData.sequence} onChange={handleChange} required className="form-input" min="1" />
        </label>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
          <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Seção</button>
        </div>
      </form>
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

export default ReportSectionEditor;