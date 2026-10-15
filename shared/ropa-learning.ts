import type { RopaField } from './ropa';

// Plain-language prompts describe the fields, never choose a legal basis or appoint a role.
export const ROPA_HELP: Record<RopaField, { meaning: string; example: string; action: string }> = {
  controller: { meaning: 'The organisation that decides why and how personal data is used.', example: 'A course business decides which details it needs to run a class.', action: 'Record the organisation and its contact details. Do not guess the legal entity.' },
  jointControllers: { meaning: 'Two or more organisations may make those decisions together. A representative may act for an organisation.', example: 'Two organisations jointly plan a registration process.', action: 'Name any shared decision-makers and representatives, or explain why this does not apply.' },
  privacyContact: { meaning: 'The person people can contact about their data. DPO means data protection officer, a specific role if appointed.', example: 'A privacy mailbox can receive questions without its owner being a DPO.', action: 'Record the confirmed contact. Do not label someone DPO unless appointed.' },
  owner: { meaning: 'The person responsible for keeping this activity record accurate.', example: 'The course organiser checks the registration record when a provider changes.', action: 'Name the responsible person or role and how to reach them.' },
  purpose: { meaning: 'The real task that needs personal information. Processing means using that information in any way.', example: 'Send joining instructions to people booked on a course.', action: 'Write one clear reason. Keep optional marketing separate from course delivery.' },
  subjects: { meaning: 'The groups of people whose information is used.', example: 'Course participants and people asking about a course.', action: 'List groups, not names or individual private records.' },
  dataCategories: { meaning: 'The kinds of personal information this activity uses.', example: 'Names and email addresses, rather than a list of actual learners.', action: 'List only the kinds needed. Check whether you collect anything you can leave out.' },
  lawfulBasis: { meaning: 'The legal reason that allows this particular use of personal data. Consent is one possible reason.', example: 'Delivering a paid course and sending optional offers need separate assessments.', action: 'Link the assessed reason and its evidence. Leave it unknown until checked; this help does not select it.' },
  recipients: { meaning: 'Who receives the data. A processor is a service that handles it on your organisation’s behalf.', example: 'An email service sends joining instructions for the organiser.', action: 'List actual recipients, providers and their roles. Check the current service settings.' },
  transfers: { meaning: 'Data may be handled outside the European Economic Area. Safeguards are the protections assessed for that transfer.', example: 'A provider may allow support staff in another country to access data.', action: 'Check actual locations and access. Record the assessment, or explain why no transfer applies.' },
  retention: { meaning: 'How long data is kept, and what causes it to be deleted or made no longer identifiable.', example: 'A course ending may start a retention review; it is not a universal deletion deadline.', action: 'Record the agreed rule and how deletion is checked. Do not invent a time period.' },
  security: { meaning: 'The practical tools and working rules that protect the information.', example: 'Named accounts, limited access, backups and staff instructions.', action: 'Describe the measures actually checked. Mark planned measures as planned.' },
  rights: { meaning: 'How people ask about their data, and who handles those requests.', example: 'A learner asks to correct their email address or receive a copy of their data.', action: 'Record the contact route and responsible person. Keep private case messages elsewhere.' },
  risks: { meaning: 'What could harm people and how you assess it. DPIA means data protection impact assessment: a structured check for data-protection risks.', example: 'Private assessment answers might reach the wrong person.', action: 'Record known risks, open questions and the assessment reference. Do not mark a review complete just because a field is filled.' },
};

export const ROPA_FIELD_GROUPS: { title: string; fields: RopaField[] }[] = [
  { title: '1. Why this activity exists and whose data it uses', fields: ['purpose', 'subjects', 'dataCategories', 'lawfulBasis'] },
  { title: '2. Who is responsible', fields: ['controller', 'jointControllers', 'privacyContact', 'owner'] },
  { title: '3. Where data goes and how it is protected', fields: ['recipients', 'transfers', 'retention', 'security', 'rights', 'risks'] },
];
