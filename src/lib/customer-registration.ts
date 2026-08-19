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

export function customerMetadata(input: UnifiedCustomerInput, source: 'self' | 'admin' = 'self') {
  return {
    name: input.name.trim(),
    full_name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
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
