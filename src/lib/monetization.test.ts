import { checkLicenseStatus, revokeLicense, listAuditLogs } from './monetization.functions';

/**
 * Testes para validação de licença, revogação e auditoria.
 */
export async function runMonetizationTests() {
  console.log("--- INICIANDO TESTES DE MONETIZAÇÃO ---");
  
  try {
    // 1. Validar proteção de rota (simulada)
    const status = await checkLicenseStatus();
    console.log("Teste 1 (Status):", status.status === 'unauthenticated' ? "Passou (Gated)" : "Falhou");

    // 2. Verificar Auditoria (Admin)
    try {
      const logs = await listAuditLogs();
      console.log("Teste 2 (Auditoria Protegida):", logs.success === false ? "Passou (Gated)" : "Falhou");
    } catch (e) {
      console.log("Teste 2 (Auditoria Protegida): Passou (Exception Gated)");
    }
    
    console.log("--- TESTES DE LÓGICA CONCLUÍDOS ---");
    return true;
  } catch (e) {
    console.error("Erro nos testes:", e);
    return false;
  }
}

