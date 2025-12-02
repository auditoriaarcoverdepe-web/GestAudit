import { supabase } from './supabase';
import { Database } from './supabase-types';
import { Audit, Finding, Recommendation, AuditorProfile, Institution, InstitutionType, AuditStage, AuditStageStatus, AuditType, AuditStatus, Priority, FindingStatus, RecommendationStatus, Risk, ImpactLevel, ProbabilityLevel, RiskLevel, CustomReportSection } from './types';

// Type aliases for Supabase types
type DbInstitution = Database['public']['Tables']['institutions']['Row'];
type DbAudit = Database['public']['Tables']['audits']['Row'];
type DbFinding = Database['public']['Tables']['findings']['Row'];
type DbRecommendation = Database['public']['Tables']['recommendations']['Row'];
type DbAuditStage = Database['public']['Tables']['audit_stages']['Row'];
type DbRisk = Database['public']['Tables']['risks']['Row'];
type DbProfile = Database['public']['Tables']['profile']['Row'];
type DbCustomReportSection = Database['public']['Tables']['custom_report_sections']['Row'];

export type AppData = {
    institutions: Institution[];
    audits: Audit[];
    findings: Finding[];
    recommendations: Recommendation[];
    auditStages: AuditStage[];
    risks: Risk[];
    profile: AuditorProfile;
    customReportSections: CustomReportSection[]; // Added custom sections
};

// --- DATABASE INITIALIZATION ---
export const initializeDatabase = async (): Promise<void> => {
  console.log('Supabase database initialized.');
};

// --- DATA ACCESS API ---

export const loadAllData = async (): Promise<AppData> => {
  try {
    // Load all data in parallel
    const [
      institutionsResult,
      auditsResult,
      findingsResult,
      recommendationsResult,
      auditStagesResult,
      risksResult,
      profileResult,
      customSectionsResult
    ] = await Promise.all([
      supabase.from('institutions').select('*'),
      supabase.from('audits').select('*'),
      supabase.from('findings').select('*'),
      supabase.from('recommendations').select('*'),
      supabase.from('audit_stages').select('*'),
      supabase.from('risks').select('*'),
      supabase.from('profile').select('*').eq('id', 1).single(),
      supabase.from('custom_report_sections').select('*'), // Fetch custom sections
    ]);

    // Convert database rows to application types
    const institutions: Institution[] = (institutionsResult.data || []).map(row => ({
      id: row.id,
      municipalityName: row.municipalityname,
      type: row.type as InstitutionType,
      cnpj: row.cnpj,
    }));

    const audits: Audit[] = (auditsResult.data || []).map(row => ({
      id: row.id,
      institutionId: row.institutionid,
      year: row.year,
      auditNumber: row.auditnumber,
      title: row.title,
      auditedSector: row.auditedsector,
      sectorResponsible: row.sectorresponsible,
      type: row.type as AuditType,
      plannedStartDate: row.plannedstartdate,
      plannedEndDate: row.plannedenddate,
      actualStartDate: row.actualstartdate || undefined,
      actualEndDate: row.actualenddate || undefined,
      status: row.status as AuditStatus,
      priority: row.priority as Priority,
      objective: row.objective || undefined,
      scope: row.scope || undefined,
      criteria: row.criteria || undefined,
      auditorNotes: row.auditornotes || undefined,
    }));

    const findings: Finding[] = (findingsResult.data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      findingCode: row.findingcode,
      summary: row.summary,
      evidence: row.evidence,
      violatedCriteria: row.violatedcriteria,
      cause: row.cause,
      effect: row.effect,
      classification: row.classification as Priority,
      status: row.status as FindingStatus,
      attachments: Array.isArray(row.attachments) ? row.attachments : [],
    }));

    const recommendations: Recommendation[] = (recommendationsResult.data || []).map(row => ({
      id: row.id,
      findingId: row.findingid,
      recommendationCode: row.recommendationcode,
      description: row.description,
      implementationResponsible: row.implementationresponsible,
      deadline: row.deadline,
      status: row.status as RecommendationStatus,
      verificationDate: row.verificationdate || undefined,
    }));

    const auditStages: AuditStage[] = (auditStagesResult.data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      name: row.name,
      plannedStartDate: row.plannedstartdate,
      plannedEndDate: row.plannedenddate,
      actualStartDate: row.actualstartdate || undefined,
      actualEndDate: row.actualenddate || undefined,
      status: row.status as AuditStageStatus,
      responsible: row.responsible || undefined,
      notes: row.notes || undefined,
    }));

    const risks: Risk[] = (risksResult.data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      description: row.description,
      impact: row.impact as ImpactLevel,
      probability: row.probability as ProbabilityLevel,
      riskLevel: row.risklevel as RiskLevel,
      controls: row.controls,
    }));
    
    const customReportSections: CustomReportSection[] = (customSectionsResult.data || []).map(row => ({
        id: row.id,
        auditId: row.auditid,
        title: row.title,
        content: row.content,
        sequence: row.sequence,
    }));

    const profile: AuditorProfile = profileResult.data ? {
      name: profileResult.data.name,
      role: profileResult.data.role,
      email: profileResult.data.email,
      signature: profileResult.data.signature,
    } : {
      name: 'Auditor de Controle',
      role: 'Auditor Interno Sênior',
      email: 'auditor@example.com',
      signature: 'Auditor de Controle'
    };

    return {
      institutions,
      audits,
      findings,
      recommendations,
      auditStages,
      risks,
      profile,
      customReportSections,
    };
  } catch (error) {
    console.error('Error loading data from Supabase:', error);
    throw error;
  }
};

// Institutions
export const saveInstitution = async (municipalityName: string, type: InstitutionType, cnpj: string): Promise<Institution[]> => {
  try {
    console.log('Attempting to save institution:', { municipalityName, type, cnpj });

    const id = `inst-${Date.now()}`;
    const { data, error } = await supabase
      .from('institutions')
      .insert({
        id,
        municipalityname: municipalityName,
        type,
        cnpj,
      })
      .select();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    // Return all institutions after insert
    const { data: allInstitutions, error: selectError } = await supabase.from('institutions').select('*');
    if (selectError) {
      console.error('Error fetching institutions after insert:', selectError);
      throw selectError;
    }

    return (allInstitutions || []).map(row => ({
      id: row.id,
      municipalityName: row.municipalityname,
      type: row.type as InstitutionType,
      cnpj: row.cnpj,
    }));
  } catch (error) {
    console.error('Error saving institution:', error);
    throw error;
  }
};

export const deleteInstitution = async (institutionId: string): Promise<AppData> => {
  try {
    const { error } = await supabase
      .from('institutions')
      .delete()
      .eq('id', institutionId);

    if (error) throw error;

    return await loadAllData();
  } catch (error) {
    console.error('Error deleting institution:', error);
    throw error;
  }
};

// Profile
export const saveProfile = async (profile: AuditorProfile): Promise<AuditorProfile> => {
  try {
    const { error } = await supabase
      .from('profile')
      .upsert({
        id: 1,
        name: profile.name,
        role: profile.role,
        email: profile.email,
        signature: profile.signature,
      });

    if (error) throw error;

    return profile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Audits
export const saveAudit = async (auditData: Omit<Audit, 'id'> | Audit, institutionId: string): Promise<Audit[]> => {
  try {
    if ('id' in auditData) {
      // Update existing audit
      const { error } = await supabase
        .from('audits')
        .update({
          institutionid: auditData.institutionId,
          year: auditData.year,
          auditnumber: auditData.auditNumber,
          title: auditData.title,
          auditedsector: auditData.auditedSector,
          sectorresponsible: auditData.sectorResponsible,
          type: auditData.type,
          plannedstartdate: auditData.plannedStartDate,
          plannedenddate: auditData.plannedEndDate,
          actualstartdate: auditData.actualStartDate || null,
          actualenddate: auditData.actualEndDate || null,
          status: auditData.status,
          priority: auditData.priority,
          objective: auditData.objective || null,
          scope: auditData.scope || null,
          criteria: auditData.criteria || null,
          auditornotes: auditData.auditorNotes || null,
        })
        .eq('id', auditData.id);

      if (error) throw error;
    } else {
      // Insert new audit
      const id = `aud-${Date.now()}`;
      const { error } = await supabase
        .from('audits')
        .insert({
          id,
          institutionid: institutionId,
          year: auditData.year,
          auditnumber: auditData.auditNumber,
          title: auditData.title,
          auditedsector: auditData.auditedSector,
          sectorresponsible: auditData.sectorResponsible,
          type: auditData.type,
          plannedstartdate: auditData.plannedStartDate,
          plannedenddate: auditData.plannedEndDate,
          actualstartdate: auditData.actualStartDate || null,
          actualenddate: auditData.actualEndDate || null,
          status: auditData.status,
          priority: auditData.priority,
          objective: auditData.objective || null,
          scope: auditData.scope || null,
          criteria: auditData.criteria || null,
          auditornotes: auditData.auditorNotes || null,
        });

      if (error) throw error;
    }

    const { data } = await supabase.from('audits').select('*');
    return (data || []).map(row => ({
      id: row.id,
      institutionId: row.institutionid,
      year: row.year,
      auditNumber: row.auditnumber,
      title: row.title,
      auditedSector: row.auditedsector,
      sectorResponsible: row.sectorresponsible,
      type: row.type as AuditType,
      plannedStartDate: row.plannedstartdate,
      plannedEndDate: row.plannedenddate,
      actualStartDate: row.actualstartdate || undefined,
      actualEndDate: row.actualenddate || undefined,
      status: row.status as AuditStatus,
      priority: row.priority as Priority,
      objective: row.objective || undefined,
      scope: row.scope || undefined,
      criteria: row.criteria || undefined,
      auditorNotes: row.auditornotes || undefined,
    }));
  } catch (error) {
    console.error('Error saving audit:', error);
    throw error;
  }
};

export const deleteAudit = async (auditId: string): Promise<AppData> => {
  try {
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', auditId);

    if (error) throw error;

    return await loadAllData();
  } catch (error) {
    console.error('Error deleting audit:', error);
    throw error;
  }
};

// Findings
export const saveFinding = async (findingData: Omit<Finding, 'id'> | Finding): Promise<Finding[]> => {
  try {
    console.log('=== DEBUG SAVE FINDING ===');
    console.log('Dados completos:', findingData);
    console.log('Todas as chaves:', Object.keys(findingData));

    // Verifique cada coluna obrigatória
    const requiredColumns = [
      'auditId', 'findingCode', 'summary', 'evidence',
      'violatedCriteria', 'cause', 'effect', 'classification', 'status'
    ];

    requiredColumns.forEach(col => {
      console.log(`${col}:`, findingData[col as keyof typeof findingData] ? 'PRESENTE' : 'AUSENTE');
    });
    console.log('=== FIM DEBUG ===');

    if ('id' in findingData) {
      // Update existing finding
      const { error } = await supabase
        .from('findings')
        .update({
          auditid: findingData.auditId,
          findingcode: findingData.findingCode,
          summary: findingData.summary,
          evidence: findingData.evidence,
          violatedcriteria: findingData.violatedCriteria,
          cause: findingData.cause,
          effect: findingData.effect,
          classification: findingData.classification,
          status: findingData.status,
          attachments: findingData.attachments || [],
        })
        .eq('id', findingData.id);

      if (error) {
        console.error('ERRO DETALHADO:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
    } else {
      // Insert new finding
      const id = `fin-${Date.now()}`;
      const { error } = await supabase
        .from('findings')
        .insert({
          id,
          auditid: findingData.auditId,
          findingcode: findingData.findingCode,
          summary: findingData.summary,
          evidence: findingData.evidence,
          violatedcriteria: findingData.violatedCriteria,
          cause: findingData.cause,
          effect: findingData.effect,
          classification: findingData.classification,
          status: findingData.status,
          attachments: findingData.attachments || [],
        });

      if (error) {
        console.error('ERRO DETALHADO:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
    }

    const { data } = await supabase.from('findings').select('*');
    return (data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      findingCode: row.findingcode,
      summary: row.summary,
      evidence: row.evidence,
      violatedCriteria: row.violatedcriteria,
      cause: row.cause,
      effect: row.effect,
      classification: row.classification as Priority,
      status: row.status as FindingStatus,
      attachments: Array.isArray(row.attachments) ? row.attachments : [],
    }));
  } catch (error) {
    console.error('Error saving finding:', error);
    throw error;
  }
};

export const deleteFinding = async (findingId: string): Promise<AppData> => {
  try {
    const { error } = await supabase
      .from('findings')
      .delete()
      .eq('id', findingId);

    if (error) throw error;

    return await loadAllData();
  } catch (error) {
    console.error('Error deleting finding:', error);
    throw error;
  }
};

// Recommendations
export const saveRecommendation = async (recData: Omit<Recommendation, 'id'> | Recommendation): Promise<Recommendation[]> => {
  try {
    console.log('=== DEBUG SAVE RECOMMENDATION ===');
    console.log('Dados completos:', recData);
    console.log('Todas as chaves:', Object.keys(recData));

    // Verifique cada coluna obrigatória
    const requiredColumns = [
      'findingId', 'recommendationCode', 'description',
      'implementationResponsible', 'deadline', 'status'
    ];

    requiredColumns.forEach(col => {
      console.log(`${col}:`, recData[col as keyof typeof recData] ? 'PRESENTE' : 'AUSENTE');
    });
    console.log('=== FIM DEBUG ===');

    if ('id' in recData) {
      // Update existing recommendation
      const { error } = await supabase
        .from('recommendations')
        .update({
          findingid: recData.findingId,
          recommendationcode: recData.recommendationCode,
          description: recData.description,
          implementationresponsible: recData.implementationResponsible,
          deadline: recData.deadline,
          status: recData.status,
          verificationdate: recData.verificationDate || null,
        })
        .eq('id', recData.id);

      if (error) {
        console.error('ERRO DETALHADO RECOMMENDATION:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
    } else {
      // Insert new recommendation
      const id = `rec-${Date.now()}`;
      const { error } = await supabase
        .from('recommendations')
        .insert({
          id,
          findingid: recData.findingId,
          recommendationcode: recData.recommendationCode,
          description: recData.description,
          implementationresponsible: recData.implementationResponsible,
          deadline: recData.deadline,
          status: recData.status,
          verificationdate: recData.verificationDate || null,
        });

      if (error) {
        console.error('ERRO DETALHADO RECOMMENDATION:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
    }

    const { data } = await supabase.from('recommendations').select('*');
    return (data || []).map(row => ({
      id: row.id,
      findingId: row.findingid,
      recommendationCode: row.recommendationcode,
      description: row.description,
      implementationResponsible: row.implementationresponsible,
      deadline: row.deadline,
      status: row.status as RecommendationStatus,
      verificationDate: row.verificationdate || undefined,
    }));
  } catch (error) {
    console.error('Error saving recommendation:', error);
    throw error;
  }
};

export const deleteRecommendation = async (recId: string): Promise<Recommendation[]> => {
  try {
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', recId);

    if (error) throw error;

    const { data } = await supabase.from('recommendations').select('*');
    return (data || []).map(row => ({
      id: row.id,
      findingId: row.findingid,
      recommendationCode: row.recommendationcode,
      description: row.description,
      implementationResponsible: row.implementationresponsible,
      deadline: row.deadline,
      status: row.status as RecommendationStatus,
      verificationDate: row.verificationdate || undefined,
    }));
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    throw error;
  }
};

// Audit Stages
export const saveAuditStage = async (stageData: Omit<AuditStage, 'id'> | AuditStage): Promise<AuditStage[]> => {
  try {
    console.log('saveAuditStage called with:', stageData);

    if ('id' in stageData) {
      // Update existing stage
      console.log('Updating existing stage with id:', stageData.id);
      const updateData = {
        auditid: stageData.auditId,
        name: stageData.name,
        plannedstartdate: stageData.plannedStartDate,
        plannedenddate: stageData.plannedEndDate,
        actualstartdate: stageData.actualStartDate || null,
        actualenddate: stageData.actualEndDate || null,
        status: stageData.status,
        responsible: stageData.responsible || null,
        notes: stageData.notes || null,
      };
      console.log('Update data:', updateData);

      const { error } = await supabase
        .from('audit_stages')
        .update(updateData)
        .eq('id', stageData.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
    } else {
      // Insert new stage
      const id = `stg-${Date.now()}`;
      console.log('Inserting new stage with id:', id);
      const insertData = {
        id,
        auditid: stageData.auditId,
        name: stageData.name,
        plannedstartdate: stageData.plannedStartDate,
        plannedenddate: stageData.plannedEndDate,
        actualstartdate: stageData.actualStartDate || null,
        actualenddate: stageData.actualEndDate || null,
        status: stageData.status,
        responsible: stageData.responsible || null,
        notes: stageData.notes || null,
      };
      console.log('Insert data:', insertData);

      const { error, data } = await supabase
        .from('audit_stages')
        .insert(insertData);

      console.log('Supabase insert response:', { data, error });

      if (error) {
        console.error('Supabase insert error details:', error);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }
    }

    const { data, error: selectError } = await supabase.from('audit_stages').select('*');
    if (selectError) {
      console.error('Error fetching audit stages after save:', selectError);
      throw selectError;
    }

    const result = (data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      name: row.name,
      plannedStartDate: row.plannedstartdate,
      plannedEndDate: row.plannedenddate,
      actualStartDate: row.actualstartdate || undefined,
      actualEndDate: row.actualenddate || undefined,
      status: row.status as AuditStageStatus,
      responsible: row.responsible || undefined,
      notes: row.notes || undefined,
    }));

    console.log('saveAuditStage completed successfully, returning:', result);
    return result;
  } catch (error) {
    console.error('Error saving audit stage:', error);
    throw error;
  }
};

export const deleteAuditStage = async (stageId: string): Promise<AuditStage[]> => {
  try {
    const { error } = await supabase
      .from('audit_stages')
      .delete()
      .eq('id', stageId);

    if (error) throw error;

    const { data } = await supabase.from('audit_stages').select('*');
    return (data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      name: row.name,
      plannedStartDate: row.plannedstartdate,
      plannedEndDate: row.plannedenddate,
      actualStartDate: row.actualstartdate || undefined,
      actualEndDate: row.actualenddate || undefined,
      status: row.status as AuditStageStatus,
      responsible: row.responsible || undefined,
      notes: row.notes || undefined,
    }));
  } catch (error) {
    console.error('Error deleting audit stage:', error);
    throw error;
  }
};

// Risk Matrix Logic
const calculateRiskLevel = (impact: ImpactLevel, probability: ProbabilityLevel): RiskLevel => {
    const impactMap: Record<ImpactLevel, number> = {
        [ImpactLevel.INSIGNIFICANT]: 1,
        [ImpactLevel.MINOR]: 2,
        [ImpactLevel.MODERATE]: 3,
        [ImpactLevel.SEVERE]: 4,
        [ImpactLevel.CATASTROPHIC]: 5,
    };
    const probabilityMap: Record<ProbabilityLevel, number> = {
        [ProbabilityLevel.RARE]: 1,
        [ProbabilityLevel.UNLIKELY]: 2,
        [ProbabilityLevel.POSSIBLE]: 3,
        [ProbabilityLevel.PROBABLE]: 4,
        [ProbabilityLevel.ALMOST_CERTAIN]: 5,
    };

    const score = impactMap[impact] * probabilityMap[probability];

    if (score >= 15) return RiskLevel.EXTREME;
    if (score >= 8) return RiskLevel.HIGH;
    if (score >= 4) return RiskLevel.MODERATE;
    return RiskLevel.LOW;
}

export const saveRisk = async (riskData: Omit<Risk, 'id' | 'riskLevel'> | Risk): Promise<Risk[]> => {
  try {
    let riskLevel: RiskLevel;
    if ('riskLevel' in riskData) {
      riskLevel = riskData.riskLevel;
    } else {
      riskLevel = calculateRiskLevel((riskData as Omit<Risk, 'id'>).impact, (riskData as Omit<Risk, 'id'>).probability);
    }

    console.log('Saving risk with data:', {
      id: 'id' in riskData ? riskData.id : `risk-${Date.now()}`,
      auditId: riskData.auditId,
      description: riskData.description,
      impact: riskData.impact,
      probability: riskData.probability,
      riskLevel,
      controls: riskData.controls,
    });

    if ('id' in riskData) {
      // Update existing risk
      const { error } = await supabase
        .from('risks')
        .update({
          auditid: riskData.auditId,
          description: riskData.description,
          impact: riskData.impact,
          probability: riskData.probability,
          risklevel: riskLevel,
          controls: riskData.controls,
        })
        .eq('id', riskData.id);

      if (error) {
        console.error('Supabase update error details:', error.message, error.details, error.hint);
        throw error;
      }
    } else {
      // Insert new risk
      const id = `risk-${Date.now()}`;
      const { error } = await supabase
        .from('risks')
        .insert({
          id,
          auditid: riskData.auditId,
          description: riskData.description,
          impact: riskData.impact,
          probability: riskData.probability,
          risklevel: riskLevel,
          controls: riskData.controls,
        });

      if (error) {
        console.error('Supabase insert error details:', error.message, error.details, error.hint);
        throw error;
      }
    }

    const { data } = await supabase.from('risks').select('*');
    return (data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      description: row.description,
      impact: row.impact as ImpactLevel,
      probability: row.probability as ProbabilityLevel,
      riskLevel: row.risklevel as RiskLevel,
      controls: row.controls,
    }));
  } catch (error) {
    console.error('Error saving risk:', error);
    throw error;
  }
};

export const deleteRisk = async (riskId: string): Promise<Risk[]> => {
  try {
    const { error } = await supabase
      .from('risks')
      .delete()
      .eq('id', riskId);

    if (error) throw error;

    const { data } = await supabase.from('risks').select('*');
    return (data || []).map(row => ({
      id: row.id,
      auditId: row.auditid,
      description: row.description,
      impact: row.impact as ImpactLevel,
      probability: row.probability as ProbabilityLevel,
      riskLevel: row.risklevel as RiskLevel,
      controls: row.controls,
    }));
  } catch (error) {
    console.error('Error deleting risk:', error);
    throw error;
  }
}

// Custom Report Sections
export const saveCustomReportSection = async (sectionData: Omit<CustomReportSection, 'id'> | CustomReportSection): Promise<CustomReportSection[]> => {
    try {
        if ('id' in sectionData) {
            // Update existing section
            const { error } = await supabase
                .from('custom_report_sections')
                .update({
                    auditid: sectionData.auditId,
                    title: sectionData.title,
                    content: sectionData.content,
                    sequence: sectionData.sequence,
                })
                .eq('id', sectionData.id);

            if (error) throw error;
        } else {
            // Insert new section
            const id = `crs-${Date.now()}`;
            const { error } = await supabase
                .from('custom_report_sections')
                .insert({
                    id,
                    auditid: sectionData.auditId,
                    title: sectionData.title,
                    content: sectionData.content,
                    sequence: sectionData.sequence,
                });

            if (error) throw error;
        }

        const { data } = await supabase.from('custom_report_sections').select('*');
        return (data || []).map(row => ({
            id: row.id,
            auditId: row.auditid,
            title: row.title,
            content: row.content,
            sequence: row.sequence,
        }));
    } catch (error) {
        console.error('Error saving custom report section:', error);
        throw error;
    }
};

export const deleteCustomReportSection = async (sectionId: string): Promise<CustomReportSection[]> => {
    try {
        const { error } = await supabase
            .from('custom_report_sections')
            .delete()
            .eq('id', sectionId);

        if (error) throw error;

        const { data } = await supabase.from('custom_report_sections').select('*');
        return (data || []).map(row => ({
            id: row.id,
            auditId: row.auditid,
            title: row.title,
            content: row.content,
            sequence: row.sequence,
        }));
    } catch (error) {
        console.error('Error deleting custom report section:', error);
        throw error;
    }
};


// Data Export
export const exportData = async () => {
    const data = await loadAllData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "gestaudit_backup.json";
    link.click();
};