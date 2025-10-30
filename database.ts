// FIX: Add AuditStatus to import to resolve 'Cannot find name' errors.
import { Audit, Finding, Recommendation, AuditorProfile, Institution, InstitutionType, AuditStage, AuditStageStatus, AuditType, AuditStatus, Priority, FindingStatus, RecommendationStatus, Risk, ImpactLevel, ProbabilityLevel, RiskLevel } from './types';
import initSqlJs from 'sql.js';

// --- MOCK DATA FOR INITIALIZATION ---
// This data will be used to seed the database if it's empty.

const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    municipalityName: 'Audiville',
    type: InstitutionType.PREFEITURA,
    cnpj: '12.345.678/0001-99'
  },
  {
    id: 'inst-2',
    municipalityName: 'Audiville',
    type: InstitutionType.CAMARA,
    cnpj: '98.765.432/0001-11'
  }
];

const MOCK_AUDITS: Audit[] = [
  {
    id: '1',
    institutionId: 'inst-1',
    year: 2024,
    auditNumber: 'AUD-2024-01',
    title: 'Auditoria de Controles Internos Financeiros',
    auditedSector: 'Financeiro',
    sectorResponsible: 'João da Silva',
    type: AuditType.FINANCIAL,
    plannedStartDate: '2024-08-15',
    plannedEndDate: '2024-09-15',
    status: AuditStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    objective: 'Verificar a eficácia dos controles internos sobre relatórios financeiros.',
    scope: 'Processos de contas a pagar, contas a receber e conciliação bancária.',
    criteria: 'COSO Framework, Políticas Internas da Empresa.',
  },
  {
    id: '2',
    institutionId: 'inst-1',
    year: 2024,
    auditNumber: 'AUD-2024-02',
    title: 'Conformidade com a LGPD',
    auditedSector: 'TI e Jurídico',
    sectorResponsible: 'Maria Oliveira',
    type: AuditType.COMPLIANCE,
    plannedStartDate: '2024-07-20',
    plannedEndDate: '2024-08-10',
    actualStartDate: '2024-07-22',
    actualEndDate: '2024-08-09',
    status: AuditStatus.COMPLETED,
    priority: Priority.HIGH,
  },
  {
    id: '3',
    institutionId: 'inst-2',
    year: 2024,
    auditNumber: 'AUD-2024-03',
    title: 'Eficiência Operacional da Logística',
    auditedSector: 'Logística',
    sectorResponsible: 'Carlos Pereira',
    type: AuditType.OPERATIONAL,
    plannedStartDate: '2024-10-01',
    plannedEndDate: '2024-10-30',
    status: AuditStatus.PLANNED,
    priority: Priority.MEDIUM,
  },
  {
    id: '4',
    institutionId: 'inst-2',
    year: 2023,
    auditNumber: 'AUD-2023-05',
    title: 'Segurança da Informação',
    auditedSector: 'Tecnologia da Informação',
    sectorResponsible: 'Ana Souza',
    type: AuditType.IT,
    plannedStartDate: '2023-11-05',
    plannedEndDate: '2023-12-05',
    status: AuditStatus.COMPLETED,
    priority: Priority.HIGH,
  },
];

const MOCK_FINDINGS: Finding[] = [
  {
    id: 'f1',
    auditId: '1',
    findingCode: 'ACH-01',
    summary: 'Falta de segregação de funções no processo de contas a pagar.',
    evidence: 'Observado que o mesmo funcionário pode criar um fornecedor e aprovar o pagamento.',
    violatedCriteria: 'Política Interna de Controles Financeiros, Seção 3.2.',
    cause: 'Falta de parametrização adequada no sistema ERP.',
    effect: 'Risco de pagamentos fraudulentos ou indevidos.',
    classification: Priority.HIGH,
    status: FindingStatus.OPEN,
    attachments: [],
  },
  {
    id: 'f2',
    auditId: '2',
    findingCode: 'ACH-02',
    summary: 'Política de Privacidade desatualizada.',
    evidence: 'A política no site da empresa não reflete os requisitos do Art. 9 da LGPD.',
    violatedCriteria: 'Lei Geral de Proteção de Dados (LGPD), Art. 9.',
    cause: 'Revisão periódica da política não foi realizada.',
    effect: 'Risco de multas e sanções da ANPD.',
    classification: Priority.MEDIUM,
    status: FindingStatus.RESOLVED,
    attachments: [],
  },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    findingId: 'f1',
    recommendationCode: 'REC-01',
    description: 'Revisar e ajustar as permissões de usuário no sistema ERP para garantir a segregação de funções entre a criação de fornecedores e a aprovação de pagamentos.',
    implementationResponsible: 'Gerente de TI',
    deadline: '2024-09-30',
    status: RecommendationStatus.IN_PROGRESS,
  },
  {
    id: 'r2',
    findingId: 'f1',
    recommendationCode: 'REC-02',
    description: 'Realizar uma revisão de todos os pagamentos aprovados pelo funcionário em questão nos últimos 6 meses.',
    implementationResponsible: 'Gerente Financeiro',
    deadline: '2024-08-30',
    status: RecommendationStatus.PENDING,
  },
  {
    id: 'r3',
    findingId: 'f2',
    recommendationCode: 'REC-03',
    description: 'Atualizar a Política de Privacidade do site para incluir todas as informações exigidas pela LGPD e submetê-la para aprovação do departamento jurídico.',
    implementationResponsible: 'Encarregado de Dados (DPO)',
    deadline: '2024-07-15',
    status: RecommendationStatus.VERIFIED,
    verificationDate: '2024-07-20'
  },
];

const MOCK_AUDIT_STAGES: AuditStage[] = [
    {
        id: 'stg-1',
        auditId: '1',
        name: 'Fase de Planejamento',
        plannedStartDate: '2024-08-15',
        plannedEndDate: '2024-08-20',
        actualStartDate: '2024-08-15',
        status: AuditStageStatus.IN_PROGRESS,
        responsible: 'Auditor de Controle',
        notes: 'Reunião inicial agendada e escopo definido.'
    },
    {
        id: 'stg-2',
        auditId: '1',
        name: 'Trabalho de Campo (Execução)',
        plannedStartDate: '2024-08-21',
        plannedEndDate: '2024-09-10',
        status: AuditStageStatus.NOT_STARTED,
        responsible: 'Auditor de Controle'
    },
    {
        id: 'stg-3',
        auditId: '1',
        name: 'Emissão do Relatório',
        plannedStartDate: '2024-09-11',
        plannedEndDate: '2024-09-15',
        status: AuditStageStatus.NOT_STARTED,
        responsible: 'Auditor de Controle'
    }
];

const MOCK_RISKS: Risk[] = [
  {
    id: 'risk-1',
    auditId: '1',
    description: 'Risco de pagamentos fraudulentos devido à falta de segregação de funções.',
    impact: ImpactLevel.SEVERE,
    probability: ProbabilityLevel.POSSIBLE,
    riskLevel: RiskLevel.HIGH,
    controls: 'Revisão mensal por amostragem dos pagamentos realizados.',
  },
  {
    id: 'risk-2',
    auditId: '2',
    description: 'Risco de sanções regulatórias por não conformidade com a LGPD.',
    impact: ImpactLevel.MODERATE,
    probability: ProbabilityLevel.PROBABLE,
    riskLevel: RiskLevel.HIGH,
    controls: 'Consultoria jurídica externa contratada para revisão das políticas.',
  },
  {
    id: 'risk-3',
    auditId: '3',
    description: 'Risco de atrasos na entrega por ineficiência no processo de roteirização.',
    impact: ImpactLevel.MINOR,
    probability: ProbabilityLevel.POSSIBLE,
    riskLevel: RiskLevel.MODERATE,
    controls: 'Software de otimização de rotas implementado.',
  },
];

const MOCK_AUDITOR_PROFILE: AuditorProfile = {
    name: 'Auditor de Controle',
    role: 'Auditor Interno Sênior',
    email: 'auditor@example.com',
    signature: 'Auditor de Controle'
};

// --- SQLite Database Setup ---
let SQL: any;
let db: any;

const DB_KEY = 'gestaudit_sqlite_db';
const DB_VERSION = '1.1';

const initializeSQLite = async () => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }

  // Try to load existing database from localStorage
  const savedDbData = localStorage.getItem(DB_KEY);
  if (savedDbData) {
    const dbArray = new Uint8Array(JSON.parse(savedDbData));
    db = new SQL.Database(dbArray);
  } else {
    db = new SQL.Database();
    createTables();
    seedDatabase();
  }
};

const saveDatabaseToLocalStorage = () => {
  if (db) {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem(DB_KEY, JSON.stringify(buffer));
  }
};

const createTables = () => {
  // Institutions table
  db.run(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      municipalityName TEXT NOT NULL,
      type TEXT NOT NULL,
      cnpj TEXT NOT NULL
    )
  `);

  // Audits table
  db.run(`
    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      institutionId TEXT NOT NULL,
      year INTEGER NOT NULL,
      auditNumber TEXT NOT NULL,
      title TEXT NOT NULL,
      auditedSector TEXT NOT NULL,
      sectorResponsible TEXT NOT NULL,
      type TEXT NOT NULL,
      plannedStartDate TEXT NOT NULL,
      plannedEndDate TEXT NOT NULL,
      actualStartDate TEXT,
      actualEndDate TEXT,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      objective TEXT,
      scope TEXT,
      criteria TEXT,
      auditorNotes TEXT,
      FOREIGN KEY (institutionId) REFERENCES institutions (id) ON DELETE CASCADE
    )
  `);

  // Findings table
  db.run(`
    CREATE TABLE IF NOT EXISTS findings (
      id TEXT PRIMARY KEY,
      auditId TEXT NOT NULL,
      findingCode TEXT NOT NULL,
      summary TEXT NOT NULL,
      evidence TEXT NOT NULL,
      violatedCriteria TEXT NOT NULL,
      cause TEXT NOT NULL,
      effect TEXT NOT NULL,
      classification TEXT NOT NULL,
      status TEXT NOT NULL,
      attachments TEXT, -- JSON string
      FOREIGN KEY (auditId) REFERENCES audits (id) ON DELETE CASCADE
    )
  `);

  // Recommendations table
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      findingId TEXT NOT NULL,
      recommendationCode TEXT NOT NULL,
      description TEXT NOT NULL,
      implementationResponsible TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL,
      verificationDate TEXT,
      FOREIGN KEY (findingId) REFERENCES findings (id) ON DELETE CASCADE
    )
  `);

  // Audit Stages table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_stages (
      id TEXT PRIMARY KEY,
      auditId TEXT NOT NULL,
      name TEXT NOT NULL,
      plannedStartDate TEXT NOT NULL,
      plannedEndDate TEXT NOT NULL,
      actualStartDate TEXT,
      actualEndDate TEXT,
      status TEXT NOT NULL,
      responsible TEXT,
      notes TEXT,
      FOREIGN KEY (auditId) REFERENCES audits (id) ON DELETE CASCADE
    )
  `);

  // Risks table
  db.run(`
    CREATE TABLE IF NOT EXISTS risks (
      id TEXT PRIMARY KEY,
      auditId TEXT NOT NULL,
      description TEXT NOT NULL,
      impact TEXT NOT NULL,
      probability TEXT NOT NULL,
      riskLevel TEXT NOT NULL,
      controls TEXT NOT NULL,
      FOREIGN KEY (auditId) REFERENCES audits (id) ON DELETE CASCADE
    )
  `);

  // Profile table
  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      signature TEXT NOT NULL
    )
  `);
};

const seedDatabase = () => {
  // Insert mock institutions
  const insertInstitution = db.prepare(`
    INSERT OR IGNORE INTO institutions (id, municipalityName, type, cnpj) VALUES (?, ?, ?, ?)
  `);
  MOCK_INSTITUTIONS.forEach(inst => {
    insertInstitution.run([inst.id, inst.municipalityName, inst.type, inst.cnpj]);
  });
  insertInstitution.free();

  // Insert mock audits
  const insertAudit = db.prepare(`
    INSERT OR IGNORE INTO audits (id, institutionId, year, auditNumber, title, auditedSector, sectorResponsible, type, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, status, priority, objective, scope, criteria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_AUDITS.forEach(audit => {
    insertAudit.run([
      audit.id, audit.institutionId, audit.year, audit.auditNumber, audit.title,
      audit.auditedSector, audit.sectorResponsible, audit.type, audit.plannedStartDate,
      audit.plannedEndDate, audit.actualStartDate || null, audit.actualEndDate || null,
      audit.status, audit.priority, audit.objective || null, audit.scope || null, audit.criteria || null
    ]);
  });
  insertAudit.free();

  // Insert mock findings
  const insertFinding = db.prepare(`
    INSERT OR IGNORE INTO findings (id, auditId, findingCode, summary, evidence, violatedCriteria, cause, effect, classification, status, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_FINDINGS.forEach(finding => {
    insertFinding.run([
      finding.id, finding.auditId, finding.findingCode, finding.summary, finding.evidence,
      finding.violatedCriteria, finding.cause, finding.effect, finding.classification,
      finding.status, JSON.stringify(finding.attachments || [])
    ]);
  });
  insertFinding.free();

  // Insert mock recommendations
  const insertRecommendation = db.prepare(`
    INSERT OR IGNORE INTO recommendations (id, findingId, recommendationCode, description, implementationResponsible, deadline, status, verificationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_RECOMMENDATIONS.forEach(rec => {
    insertRecommendation.run([
      rec.id, rec.findingId, rec.recommendationCode, rec.description,
      rec.implementationResponsible, rec.deadline, rec.status, rec.verificationDate || null
    ]);
  });
  insertRecommendation.free();

  // Insert mock audit stages
  const insertStage = db.prepare(`
    INSERT OR IGNORE INTO audit_stages (id, auditId, name, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, status, responsible, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_AUDIT_STAGES.forEach(stage => {
    insertStage.run([
      stage.id, stage.auditId, stage.name, stage.plannedStartDate, stage.plannedEndDate,
      stage.actualStartDate || null, stage.actualEndDate || null, stage.status,
      stage.responsible || null, stage.notes || null
    ]);
  });
  insertStage.free();

  // Insert mock risks
  const insertRisk = db.prepare(`
    INSERT OR IGNORE INTO risks (id, auditId, description, impact, probability, riskLevel, controls) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_RISKS.forEach(risk => {
    insertRisk.run([
      risk.id, risk.auditId, risk.description, risk.impact, risk.probability,
      risk.riskLevel, risk.controls
    ]);
  });
  insertRisk.free();

  // Insert mock profile
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO profile (id, name, role, email, signature) VALUES (1, ?, ?, ?, ?)
  `);
  insertProfile.run([
    MOCK_AUDITOR_PROFILE.name, MOCK_AUDITOR_PROFILE.role,
    MOCK_AUDITOR_PROFILE.email, MOCK_AUDITOR_PROFILE.signature
  ]);
  insertProfile.free();

  saveDatabaseToLocalStorage();
};

// --- DATABASE INITIALIZATION ---
export const initializeDatabase = async () => {
  await initializeSQLite();
  console.log('SQLite database initialized with mock data.');
};

// --- DATA ACCESS API ---

export type AppData = {
    institutions: Institution[];
    audits: Audit[];
    findings: Finding[];
    recommendations: Recommendation[];
    auditStages: AuditStage[];
    risks: Risk[];
    profile: AuditorProfile;
};

export const loadAllData = (): AppData => {
  if (!db) throw new Error('Database not initialized');

  const institutions: Institution[] = [];
  const stmt = db.prepare('SELECT * FROM institutions');
  while (stmt.step()) {
    const row = stmt.getAsObject();
    institutions.push({
      id: row.id as string,
      municipalityName: row.municipalityName as string,
      type: row.type as InstitutionType,
      cnpj: row.cnpj as string,
    });
  }
  stmt.free();

  const audits: Audit[] = [];
  const auditStmt = db.prepare('SELECT * FROM audits');
  while (auditStmt.step()) {
    const row = auditStmt.getAsObject();
    audits.push({
      id: row.id as string,
      institutionId: row.institutionId as string,
      year: row.year as number,
      auditNumber: row.auditNumber as string,
      title: row.title as string,
      auditedSector: row.auditedSector as string,
      sectorResponsible: row.sectorResponsible as string,
      type: row.type as AuditType,
      plannedStartDate: row.plannedStartDate as string,
      plannedEndDate: row.plannedEndDate as string,
      actualStartDate: row.actualStartDate as string || undefined,
      actualEndDate: row.actualEndDate as string || undefined,
      status: row.status as AuditStatus,
      priority: row.priority as Priority,
      objective: row.objective as string || undefined,
      scope: row.scope as string || undefined,
      criteria: row.criteria as string || undefined,
      auditorNotes: row.auditorNotes as string || undefined,
    });
  }
  auditStmt.free();

  const findings: Finding[] = [];
  const findingStmt = db.prepare('SELECT * FROM findings');
  while (findingStmt.step()) {
    const row = findingStmt.getAsObject();
    findings.push({
      id: row.id as string,
      auditId: row.auditId as string,
      findingCode: row.findingCode as string,
      summary: row.summary as string,
      evidence: row.evidence as string,
      violatedCriteria: row.violatedCriteria as string,
      cause: row.cause as string,
      effect: row.effect as string,
      classification: row.classification as Priority,
      status: row.status as FindingStatus,
      attachments: JSON.parse(row.attachments as string || '[]'),
    });
  }
  findingStmt.free();

  const recommendations: Recommendation[] = [];
  const recStmt = db.prepare('SELECT * FROM recommendations');
  while (recStmt.step()) {
    const row = recStmt.getAsObject();
    recommendations.push({
      id: row.id as string,
      findingId: row.findingId as string,
      recommendationCode: row.recommendationCode as string,
      description: row.description as string,
      implementationResponsible: row.implementationResponsible as string,
      deadline: row.deadline as string,
      status: row.status as RecommendationStatus,
      verificationDate: row.verificationDate as string || undefined,
    });
  }
  recStmt.free();

  const auditStages: AuditStage[] = [];
  const stageStmt = db.prepare('SELECT * FROM audit_stages');
  while (stageStmt.step()) {
    const row = stageStmt.getAsObject();
    auditStages.push({
      id: row.id as string,
      auditId: row.auditId as string,
      name: row.name as string,
      plannedStartDate: row.plannedStartDate as string,
      plannedEndDate: row.plannedEndDate as string,
      actualStartDate: row.actualStartDate as string || undefined,
      actualEndDate: row.actualEndDate as string || undefined,
      status: row.status as AuditStageStatus,
      responsible: row.responsible as string || undefined,
      notes: row.notes as string || undefined,
    });
  }
  stageStmt.free();

  const risks: Risk[] = [];
  const riskStmt = db.prepare('SELECT * FROM risks');
  while (riskStmt.step()) {
    const row = riskStmt.getAsObject();
    risks.push({
      id: row.id as string,
      auditId: row.auditId as string,
      description: row.description as string,
      impact: row.impact as ImpactLevel,
      probability: row.probability as ProbabilityLevel,
      riskLevel: row.riskLevel as RiskLevel,
      controls: row.controls as string,
    });
  }
  riskStmt.free();

  const profileStmt = db.prepare('SELECT * FROM profile WHERE id = 1');
  let profile: AuditorProfile = MOCK_AUDITOR_PROFILE;
  if (profileStmt.step()) {
    const row = profileStmt.getAsObject();
    profile = {
      name: row.name as string,
      role: row.role as string,
      email: row.email as string,
      signature: row.signature as string,
    };
  }
  profileStmt.free();

  return {
    institutions,
    audits,
    findings,
    recommendations,
    auditStages,
    risks,
    profile,
  };
};

// Institutions
export const saveInstitution = (municipalityName: string, type: InstitutionType, cnpj: string): Institution[] => {
  if (!db) throw new Error('Database not initialized');

  const id = `inst-${Date.now()}`;
  const stmt = db.prepare(`
    INSERT INTO institutions (id, municipalityName, type, cnpj) VALUES (?, ?, ?, ?)
  `);
  stmt.run([id, municipalityName, type, cnpj]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData().institutions;
};

export const deleteInstitution = (institutionId: string): AppData => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM institutions WHERE id = ?');
  stmt.run([institutionId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData();
};

// Profile
export const saveProfile = (profile: AuditorProfile): AuditorProfile => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO profile (id, name, role, email, signature) VALUES (1, ?, ?, ?, ?)
  `);
  stmt.run([profile.name, profile.role, profile.email, profile.signature]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return profile;
};

// Audits
export const saveAudit = (auditData: Omit<Audit, 'id'> | Audit, institutionId: string): Audit[] => {
  if (!db) throw new Error('Database not initialized');

  if ('id' in auditData) {
    const stmt = db.prepare(`
      UPDATE audits SET institutionId = ?, year = ?, auditNumber = ?, title = ?, auditedSector = ?, sectorResponsible = ?, type = ?, plannedStartDate = ?, plannedEndDate = ?, actualStartDate = ?, actualEndDate = ?, status = ?, priority = ?, objective = ?, scope = ?, criteria = ?, auditorNotes = ? WHERE id = ?
    `);
    stmt.run([
      auditData.institutionId, auditData.year, auditData.auditNumber, auditData.title,
      auditData.auditedSector, auditData.sectorResponsible, auditData.type, auditData.plannedStartDate,
      auditData.plannedEndDate, auditData.actualStartDate || null, auditData.actualEndDate || null,
      auditData.status, auditData.priority, auditData.objective || null, auditData.scope || null,
      auditData.criteria || null, auditData.auditorNotes || null, auditData.id
    ]);
    stmt.free();
  } else {
    const id = `aud-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO audits (id, institutionId, year, auditNumber, title, auditedSector, sectorResponsible, type, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, status, priority, objective, scope, criteria, auditorNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      id, institutionId, auditData.year, auditData.auditNumber, auditData.title,
      auditData.auditedSector, auditData.sectorResponsible, auditData.type, auditData.plannedStartDate,
      auditData.plannedEndDate, auditData.actualStartDate || null, auditData.actualEndDate || null,
      auditData.status, auditData.priority, auditData.objective || null, auditData.scope || null,
      auditData.criteria || null, auditData.auditorNotes || null
    ]);
    stmt.free();
  }
  saveDatabaseToLocalStorage();
  return loadAllData().audits;
};

export const deleteAudit = (auditId: string) => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM audits WHERE id = ?');
  stmt.run([auditId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData();
};

// Findings
export const saveFinding = (findingData: Omit<Finding, 'id'> | Finding): Finding[] => {
  if (!db) throw new Error('Database not initialized');

  if ('id' in findingData) {
    const stmt = db.prepare(`
      UPDATE findings SET auditId = ?, findingCode = ?, summary = ?, evidence = ?, violatedCriteria = ?, cause = ?, effect = ?, classification = ?, status = ?, attachments = ? WHERE id = ?
    `);
    stmt.run([
      findingData.auditId, findingData.findingCode, findingData.summary, findingData.evidence,
      findingData.violatedCriteria, findingData.cause, findingData.effect, findingData.classification,
      findingData.status, JSON.stringify(findingData.attachments || []), findingData.id
    ]);
    stmt.free();
  } else {
    const id = `fin-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO findings (id, auditId, findingCode, summary, evidence, violatedCriteria, cause, effect, classification, status, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      id, findingData.auditId, findingData.findingCode, findingData.summary, findingData.evidence,
      findingData.violatedCriteria, findingData.cause, findingData.effect, findingData.classification,
      findingData.status, JSON.stringify(findingData.attachments || [])
    ]);
    stmt.free();
  }
  saveDatabaseToLocalStorage();
  return loadAllData().findings;
};

export const deleteFinding = (findingId: string) => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM findings WHERE id = ?');
  stmt.run([findingId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData();
};

// Recommendations
export const saveRecommendation = (recData: Omit<Recommendation, 'id'> | Recommendation): Recommendation[] => {
  if (!db) throw new Error('Database not initialized');

  if ('id' in recData) {
    const stmt = db.prepare(`
      UPDATE recommendations SET findingId = ?, recommendationCode = ?, description = ?, implementationResponsible = ?, deadline = ?, status = ?, verificationDate = ? WHERE id = ?
    `);
    stmt.run([
      recData.findingId, recData.recommendationCode, recData.description,
      recData.implementationResponsible, recData.deadline, recData.status,
      recData.verificationDate || null, recData.id
    ]);
    stmt.free();
  } else {
    const id = `rec-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO recommendations (id, findingId, recommendationCode, description, implementationResponsible, deadline, status, verificationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      id, recData.findingId, recData.recommendationCode, recData.description,
      recData.implementationResponsible, recData.deadline, recData.status,
      recData.verificationDate || null
    ]);
    stmt.free();
  }
  saveDatabaseToLocalStorage();
  return loadAllData().recommendations;
};

export const deleteRecommendation = (recId: string): Recommendation[] => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM recommendations WHERE id = ?');
  stmt.run([recId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData().recommendations;
};

// Audit Stages
export const saveAuditStage = (stageData: Omit<AuditStage, 'id'> | AuditStage): AuditStage[] => {
  if (!db) throw new Error('Database not initialized');

  if ('id' in stageData) {
    const stmt = db.prepare(`
      UPDATE audit_stages SET auditId = ?, name = ?, plannedStartDate = ?, plannedEndDate = ?, actualStartDate = ?, actualEndDate = ?, status = ?, responsible = ?, notes = ? WHERE id = ?
    `);
    stmt.run([
      stageData.auditId, stageData.name, stageData.plannedStartDate, stageData.plannedEndDate,
      stageData.actualStartDate || null, stageData.actualEndDate || null, stageData.status,
      stageData.responsible || null, stageData.notes || null, stageData.id
    ]);
    stmt.free();
  } else {
    const id = `stg-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO audit_stages (id, auditId, name, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, status, responsible, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      id, stageData.auditId, stageData.name, stageData.plannedStartDate, stageData.plannedEndDate,
      stageData.actualStartDate || null, stageData.actualEndDate || null, stageData.status,
      stageData.responsible || null, stageData.notes || null
    ]);
    stmt.free();
  }
  saveDatabaseToLocalStorage();
  return loadAllData().auditStages;
};

export const deleteAuditStage = (stageId: string): AuditStage[] => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM audit_stages WHERE id = ?');
  stmt.run([stageId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData().auditStages;
};

// --- Risk Matrix Logic ---
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


export const saveRisk = (riskData: Omit<Risk, 'id' | 'riskLevel'> | Risk): Risk[] => {
  if (!db) throw new Error('Database not initialized');

  const riskLevel = calculateRiskLevel(riskData.impact, riskData.probability);

  if ('id' in riskData) {
    const stmt = db.prepare(`
      UPDATE risks SET auditId = ?, description = ?, impact = ?, probability = ?, riskLevel = ?, controls = ? WHERE id = ?
    `);
    stmt.run([
      riskData.auditId, riskData.description, riskData.impact, riskData.probability,
      riskLevel, riskData.controls, riskData.id
    ]);
    stmt.free();
  } else {
    const id = `risk-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO risks (id, auditId, description, impact, probability, riskLevel, controls) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      id, riskData.auditId, riskData.description, riskData.impact, riskData.probability,
      riskLevel, riskData.controls
    ]);
    stmt.free();
  }
  saveDatabaseToLocalStorage();
  return loadAllData().risks;
};

export const deleteRisk = (riskId: string): Risk[] => {
  if (!db) throw new Error('Database not initialized');

  const stmt = db.prepare('DELETE FROM risks WHERE id = ?');
  stmt.run([riskId]);
  stmt.free();
  saveDatabaseToLocalStorage();
  return loadAllData().risks;
}


// Data Export
export const exportData = () => {
    const data = loadAllData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "gestaudit_backup.json";
    link.click();
};
