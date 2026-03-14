import { isConnectorEnabled } from './connectorGuard';

const TYPEFORM_API_BASE = 'https://api.typeform.com';

async function getTypeformToken(): Promise<string> {
  const token = process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      'TYPEFORM_PERSONAL_ACCESS_TOKEN not set. Add it to Replit Secrets to enable Typeform API queries. ' +
      'Also set TYPEFORM_FORM_ID to the ID of your onboarding form (found in the Typeform URL: https://admin.typeform.com/form/<FORM_ID>).'
    );
  }
  return token;
}

export interface TypeformFormResponse {
  formId: string;
  title: string;
  totalResponses: number;
  completionRate: number | null;
}

export async function getTypeformFormStats(formId: string): Promise<TypeformFormResponse> {
  if (!(await isConnectorEnabled("typeform"))) {
    throw new Error('Typeform connector is disabled. Enable it in Admin > Connected Tools.');
  }

  const token = await getTypeformToken();

  const [formRes, responsesRes, insightsRes] = await Promise.all([
    fetch(`${TYPEFORM_API_BASE}/forms/${formId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${TYPEFORM_API_BASE}/forms/${formId}/responses?page_size=1&completed=true`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${TYPEFORM_API_BASE}/insights/${formId}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null),
  ]);

  if (!formRes.ok) {
    throw new Error(`Typeform API error: ${formRes.status} ${formRes.statusText}`);
  }

  const formData = await formRes.json();
  const responsesData = responsesRes.ok ? await responsesRes.json() : null;
  const insightsData = insightsRes && insightsRes.ok ? await insightsRes.json() : null;

  let completionRate: number | null = null;
  if (insightsData?.average_percentage_completion != null) {
    completionRate = Math.round(insightsData.average_percentage_completion);
  } else if (insightsData?.completion_rate != null) {
    completionRate = Math.round(insightsData.completion_rate * 100);
  }

  return {
    formId,
    title: formData.title || formId,
    totalResponses: responsesData?.total_items || 0,
    completionRate,
  };
}

export async function listTypeformForms(): Promise<Array<{ id: string; title: string }>> {
  if (!(await isConnectorEnabled("typeform"))) {
    throw new Error('Typeform connector is disabled. Enable it in Admin > Connected Tools.');
  }

  const token = await getTypeformToken();

  const res = await fetch(`${TYPEFORM_API_BASE}/forms?page_size=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Typeform API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.items || []).map((f: { id: string; title: string }) => ({
    id: f.id,
    title: f.title,
  }));
}
