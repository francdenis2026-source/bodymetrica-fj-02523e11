export type UnifiedCustomerInput = {
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  biologicalSex?: 'female' | 'male' | 'not_informed' | '';
  goal: string;
  weight: number;
  height: number;
  activityLevel: string;
};

export const GOAL_OPTIONS = [
  { value: 'weight_loss', label: 'Emagrecimento' },
  { value: 'hypertrophy', label: 'Hipertrofia / ganho de massa' },
  { value: 'recomposition', label: 'Recomposição corporal' },
  { value: 'conditioning', label: 'Condicionamento físico' },
  { value: 'maintenance', label: 'Manutenção de peso' },
] as const;

export const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentário' },
  { value: 'light', label: 'Levemente ativo' },
  { value: 'moderate', label: 'Moderadamente ativo' },
  { value: 'active', label: 'Ativo' },
  { value: 'very_active', label: 'Muito ativo' },
] as const;

const INVALID_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'invalid',
  'localhost',
  'test.com',
]);

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.con': 'icloud.com',
};

export function normalizeCpf(value: string) {
  return String(value || '').replace(/\D/g, '').slice(0, 11);
}

export function formatCpf(value: string) {
  const digits = normalizeCpf(value);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i += 1) sum += Number(cpf[i]) * (length + 1 - i);
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  return calcDigit(9) === Number(cpf[9]) && calcDigit(10) === Number(cpf[10]);
}

export function normalizeEmail(value: string) {
  return String(value || '').trim().toLowerCase();
}

export function getEmailValidationError(value: string): string | null {
  const email = normalizeEmail(value);
  if (!email) return 'Informe seu e-mail.';
  if (email.length > 254 || email.includes(' ')) return 'Informe um e-mail válido.';

  const parts = email.split('@');
  if (parts.length !== 2) return 'Informe um e-mail válido, por exemplo nome@dominio.com.';

  const [local, domain] = parts;
  if (!local || !domain || local.length > 64) return 'Informe um e-mail válido.';
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return 'Informe um e-mail válido.';
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return 'Informe um e-mail válido.';
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(domain)) {
    return 'O domínio do e-mail parece inválido.';
  }

  if (INVALID_EMAIL_DOMAINS.has(domain)) return 'Use um endereço de e-mail real. Domínios de exemplo ou teste não são aceitos.';

  const suggestion = COMMON_DOMAIN_TYPOS[domain];
  if (suggestion) return `Confira o domínio do e-mail. Você quis dizer ${suggestion}?`;

  return null;
}

export function isValidEmail(value: string) {
  return getEmailValidationError(value) === null;
}

export function customerMetadata(input: UnifiedCustomerInput, source: 'self' | 'admin' = 'self') {
  return {
    name: input.name.trim(),
    full_name: input.name.trim(),
    email: normalizeEmail(input.email),
    cpf: normalizeCpf(input.cpf),
    birth_date: input.birthDate || null,
    biological_sex: input.biologicalSex || 'not_informed',
    goal: input.goal,
    weight: Number(input.weight),
    height: Number(input.height),
    activity_level: input.activityLevel,
    registration_source: source,
  };
}
