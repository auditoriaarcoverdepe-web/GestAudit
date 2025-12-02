import React, { useState } from 'react';
import { Finding, Recommendation, FindingStatus, Priority, Audit, Attachment } from '../types';
import Modal from './Modal';
import RecommendationForm from './RecommendationForm';
import { PlusCircleIcon, PencilIcon, TrashIcon } from './Icons';

interface FindingFormProps {
  auditId?: string;
  finding?: Finding;
  audits: Audit[];
  recommendations: Recommendation[];
  onSaveFinding: (finding: Omit<Finding, 'id'> | Finding) => void;
  onClose: () => void;
  onSaveRecommendation: (rec: Omit<Recommendation, 'id'> | Recommendation) => void;
  onDeleteRecommendation: (recId: string) => void;
}

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const textareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";
const selectClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-claro focus:border-azul-claro sm:text-sm";


const FindingForm: React.FC<FindingFormProps> = (props) => {
  const { auditId, finding, audits, recommendations, onSaveFinding, onClose, onSaveRecommendation, onDeleteRecommendation } = props;
  
  const [formData, setFormData] = useState<Omit<Finding, 'id' | 'attachments'>>(finding || {
    auditId: auditId || '',
    findingCode: '',
    summary: '',
    evidence: '',
    violatedCriteria: '',
    cause: '',
    effect: '',
    classification: Priority.MEDIUM,
    status: FindingStatus.OPEN,
  });

  const [attachments, setAttachments] = useState<Attachment[]>(finding?.attachments || []);
  const [recModalState, setRecModalState] = useState<{ type: 'new' | 'edit', rec?: Recommendation } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const findingData = { ...formData, attachments };
    if (finding) {
      onSaveFinding({ ...finding, ...findingData });
    } else {
      onSaveFinding(findingData);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Explicitly type `file` as `File` to address type inference issues in some environments.
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newAttachment: Attachment = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: file.type,
            data: reader.result as string,
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = ''; // Allow re-selecting the same file
    }
  };

  const handleRemoveAttachment = (idToRemove: string) => {
    setAttachments(prev => prev.filter(att => att.id !== idToRemove));
  };
  
  const handleDownloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleSaveRecommendation = (rec: Omit<Recommendation, 'id'> | Recommendation) => {
    onSaveRecommendation(rec);
    setRecModalState(null);
  };

  return (
    <>
      <Modal title={finding ? 'Editar Achado' : 'Novo Achado'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Finding Form Fields */}
          {!auditId && (
             <label className="block">
                <span className="text-gray-700">Auditoria*</span>
                <select name="auditId" value={formData.auditId} onChange={handleChange} required className={selectClasses}>
                    <option value="" disabled>Selecione uma auditoria</option>
                    {audits.map(a => <option key={a.id} value={a.id}>{a.auditNumber} - {a.title}</option>)}
                </select>
             </label>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Código do Achado*</span>
              <input type="text" name="findingCode" value={formData.findingCode} onChange={handleChange} required className={inputClasses} />
            </label>
            <label className="block">
              <span className="text-gray-700">Resumo do Achado*</span>
              <input type="text" name="summary" value={formData.summary} onChange={handleChange} required className={inputClasses} />
            </label>
            <label className="block">
              <span className="text-gray-700">Classificação*</span>
              <select name="classification" value={formData.classification} onChange={handleChange} required className={selectClasses}>
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Status*</span>
              <select name="status" value={formData.status} onChange={handleChange} required className={selectClasses}>
                {Object.values(FindingStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-gray-700">Critério Violado*</span>
            <textarea name="violatedCriteria" value={formData.violatedCriteria} onChange={handleChange} required className={textareaClasses} rows={2}></textarea>
          </label>
          <label className="block">
            <span className="text-gray-700">Evidência (Descrição)*</span>
            <textarea name="evidence" value={formData.evidence} onChange={handleChange} required className={textareaClasses} rows={3}></textarea>
          </label>

           {/* New Attachment Section */}
           <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-azul-escuro mb-2">Anexos de Evidência</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <label htmlFor="file-upload" className="cursor-pointer bg-cinza-claro text-azul-escuro font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Selecionar Arquivos
                  </label>
                  <input id="file-upload" name="file-upload" type="file" multiple onChange={handleFileChange} className="sr-only" />
                  <p className="text-xs text-gray-500 mt-2">Você pode anexar múltiplos arquivos como evidência.</p>
              </div>
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
                  {attachments.length > 0 ? attachments.map(att => (
                      <div key={att.id} className="bg-cinza-claro p-3 rounded-md flex justify-between items-center">
                          <button type="button" onClick={() => handleDownloadAttachment(att)} className="font-semibold text-sm text-blue-600 hover:underline truncate" title={att.name}>
                              {att.name}
                          </button>
                          <button type="button" onClick={() => handleRemoveAttachment(att.id)} className="ml-4 text-red-600 hover:text-red-800 flex-shrink-0"><TrashIcon /></button>
                      </div>
                  )) : <p className="text-sm text-gray-500 italic">Nenhum arquivo anexado.</p>}
              </div>
          </div>

          <label className="block">
            <span className="text-gray-700">Causa</span>
            <textarea name="cause" value={formData.cause} onChange={handleChange} className={textareaClasses} rows={2}></textarea>
          </label>
          <label className="block">
            <span className="text-gray-700">Efeito / Risco</span>
            <textarea name="effect" value={formData.effect} onChange={handleChange} className={textareaClasses} rows={2}></textarea>
          </label>
          
          {/* Recommendations Section */}
          {finding && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-azul-escuro">Recomendações</h3>
                <button type="button" onClick={() => setRecModalState({ type: 'new' })} className="flex items-center gap-2 text-white font-bold py-1 px-3 text-sm rounded-lg shadow bg-azul-claro hover:bg-azul-escuro transition duration-300">
                  <PlusCircleIcon className="w-5 h-5" /> Nova
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {recommendations.length > 0 ? recommendations.map(rec => (
                  <div key={rec.id} className="bg-cinza-claro p-3 rounded-md flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{rec.recommendationCode}: {rec.description}</p>
                      <p className="text-xs text-gray-600">Prazo: {new Date(rec.deadline).toLocaleDateString('pt-BR')} | Status: {rec.status}</p>
                    </div>
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <button type="button" onClick={() => setRecModalState({ type: 'edit', rec })} className="text-blue-600 hover:text-blue-800"><PencilIcon /></button>
                      <button type="button" onClick={() => onDeleteRecommendation(rec.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500 italic">Nenhuma recomendação associada.</p>}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-azul-claro text-white font-bold py-2 px-4 rounded-lg">Salvar Achado</button>
          </div>
        </form>
      </Modal>

      {recModalState && finding && (
        <RecommendationForm
          findingId={finding.id}
          recommendation={recModalState.type === 'edit' ? recModalState.rec : undefined}
          onSave={handleSaveRecommendation}
          onClose={() => setRecModalState(null)}
          findings={[]}
          audits={[]}
        />
      )}
    </>
  );
};

export default FindingForm;