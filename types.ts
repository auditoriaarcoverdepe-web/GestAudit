// FIX: Removed circular import and mock data. Added all type definitions.
export enum InstitutionType {
    PREFEITURA = 'Prefeitura',
    CAMARA = 'Câmara Municipal',
}

export interface Institution {
    id: string;
    municipalityName: string;
    type: InstitutionType;
    cnpj: string;
}

export enum AuditType {
    FINANCIAL = 'Financeira',
    COMPLIANCE = 'Conformidade',
    OPERATIONAL = 'Operacional',
    IT = 'Tecnologia da Informação',
    SYSTEMS = 'Sistemas',
    QUALITY = 'Qualidade',
}

export enum AuditStatus {
    PLANNED = 'Planejada',
    IN_PROGRESS = 'Em Andamento',
    IN_ANALYSIS = 'Em Análise',
    REPORT_ISSUED = 'Relatório Emitido',
    COMPLETED = 'Concluída',
    POSTPONED = 'Adiada',
    CANCELED = 'Cancelada',
    CLOSED = 'Encerrada',
}

export enum Priority {
    HIGH = 'Alta',
    MEDIUM = 'Média',
    LOW = 'Baixa',
}

export interface Audit {
    id: string;
    institutionId: string;
    year: number;
    auditNumber: string;
    title: string;
    auditedSector: string;
    sectorResponsible: string;
    type: AuditType;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    status: AuditStatus;
    priority: Priority;
    objective?: string;
    scope?: string;
    criteria?: string;
    auditorNotes?: string;
}

export enum FindingStatus {
    OPEN = 'Aberta',
    IN_ANALYSIS = 'Em Análise',
    RESOLVED = 'Resolvida',
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    data: string; // base64 encoded file content
}

export interface Finding {
    id: string;
    auditId: string;
    findingCode: string;
    summary: string;
    evidence: string;
    violatedCriteria: string;
    cause: string;
    effect: string;
    classification: Priority;
    status: FindingStatus;
    attachments?: Attachment[];
}

export enum RecommendationStatus {
    PENDING = 'Pendente',
    IN_PROGRESS = 'Em Andamento',
    COMPLETED = 'Implementada',
    VERIFIED = 'Verificada',
    NOT_APPLICABLE = 'Não Aplicável',
}

export interface Recommendation {
    id: string;
    findingId: string;
    recommendationCode: string;
    description: string;
    implementationResponsible: string;
    deadline: string;
    status: RecommendationStatus;
    verificationDate?: string;
}

export interface AuditorProfile {
    name: string;
    role: string;
    email: string;
    signature: string;
}

export enum AuditStageStatus {
    NOT_STARTED = 'Não Iniciada',
    IN_PROGRESS = 'Em Andamento',
    COMPLETED = 'Concluída',
    DELAYED = 'Atrasada',
}

export interface AuditStage {
    id: string;
    auditId: string;
    name: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    status: AuditStageStatus;
    responsible?: string;
    notes?: string;
}

// --- Risk Matrix Types ---

export enum ImpactLevel {
    INSIGNIFICANT = 'Insignificante',
    MINOR = 'Menor',
    MODERATE = 'Moderado',
    SEVERE = 'Grave',
    CATASTROPHIC = 'Catastrófico',
}

export enum ProbabilityLevel {
    RARE = 'Raro',
    UNLIKELY = 'Improvável',
    POSSIBLE = 'Possível',
    PROBABLE = 'Provável',
    ALMOST_CERTAIN = 'Quase Certo',
}

export enum RiskLevel {
    LOW = 'Baixo',
    MODERATE = 'Moderado',
    HIGH = 'Alto',
    EXTREME = 'Extremo',
}

export interface Risk {
    id: string;
    auditId: string;
    description: string;
    impact: ImpactLevel;
    probability: ProbabilityLevel;
    riskLevel: RiskLevel;
    controls: string; // Existing controls
}

// --- Custom Report Section Type ---
export interface CustomReportSection {
    id: string;
    auditId: string; // Link to the audit
    title: string;
    content: string;
    sequence: number;
}