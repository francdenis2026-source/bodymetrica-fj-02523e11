import { z } from "zod";

export const cpfSchema = z.string()
  .min(11, "CPF deve ter 11 dígitos")
  .max(14, "CPF inválido")
  .refine((cpf) => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validation logic for CPF digits
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;
    
    return true;
  }, "CPF inválido");

export const maskCpf = (cpf: string) => {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length <= 9) return clean.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.***.$3-$4");
};

export const formatCpf = (cpf: string) => {
  const clean = cpf.replace(/\D/g, "").substring(0, 11);
  return clean
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
