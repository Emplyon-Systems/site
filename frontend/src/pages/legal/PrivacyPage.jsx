import { LegalPage, Section, P, Ul } from './LegalPage';

export function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidade" lastUpdated="24 de abril de 2026">
      <Section title="1. Introdução">
        <P>
          A <strong>Emplyon Systems</strong> respeita a sua privacidade e está comprometida em proteger
          seus dados pessoais. Esta Política descreve como coletamos, usamos, armazenamos e
          compartilhamos informações de acordo com a{' '}
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
        </P>
      </Section>

      <Section title="2. Dados que Coletamos">
        <P>Podemos coletar as seguintes categorias de dados:</P>
        <Ul items={[
          'Dados de identificação: nome, e-mail, CPF/CNPJ, cargo e empresa',
          'Dados de acesso: endereço IP, navegador, sistema operacional, páginas visitadas',
          'Dados de uso da plataforma: escalas criadas, ações realizadas, horários de acesso',
          'Dados de comunicação: mensagens enviadas por formulários ou e-mail',
          'Dados de faturamento: informações necessárias para processamento de pagamentos',
        ]} />
      </Section>

      <Section title="3. Como Usamos os Dados">
        <P>Utilizamos seus dados para:</P>
        <Ul items={[
          'Fornecer, operar e melhorar a plataforma Emplyon',
          'Processar transações e gerenciar sua conta',
          'Enviar comunicações relacionadas ao serviço (atualizações, alertas)',
          'Cumprir obrigações legais e regulatórias',
          'Prevenir fraudes e garantir a segurança da plataforma',
          'Analisar o uso do serviço para aprimoramento contínuo',
        ]} />
      </Section>

      <Section title="4. Base Legal para o Tratamento">
        <P>O tratamento dos seus dados pessoais é fundamentado em:</P>
        <Ul items={[
          'Execução de contrato — para prestação dos serviços contratados',
          'Consentimento — quando solicitado explicitamente (ex: cookies de marketing)',
          'Legítimo interesse — para melhorias do serviço e prevenção de fraudes',
          'Cumprimento de obrigação legal — quando exigido por lei',
        ]} />
      </Section>

      <Section title="5. Compartilhamento de Dados">
        <P>
          Não vendemos seus dados pessoais. Podemos compartilhá-los com:
        </P>
        <Ul items={[
          'Fornecedores de serviços que nos auxiliam na operação da plataforma (ex: hospedagem, e-mail)',
          'Parceiros de processamento de pagamento, sob contrato de sigilo',
          'Autoridades competentes, quando exigido por lei ou ordem judicial',
        ]} />
      </Section>

      <Section title="6. Seus Direitos (LGPD)">
        <P>Como titular dos dados, você tem direito a:</P>
        <Ul items={[
          'Confirmar a existência do tratamento dos seus dados',
          'Acessar os dados que temos sobre você',
          'Corrigir dados incompletos, inexatos ou desatualizados',
          'Solicitar a anonimização, bloqueio ou eliminação dos dados',
          'Revogar o consentimento a qualquer momento',
          'Solicitar portabilidade dos dados a outro fornecedor',
        ]} />
        <P>
          Para exercer seus direitos, entre em contato pelo e-mail{' '}
          <a href="mailto:adm.emplyon@gmail.com" className="text-royal-blue hover:underline">
            adm.emplyon@gmail.com
          </a>.
        </P>
      </Section>

      <Section title="7. Retenção de Dados">
        <P>
          Mantemos seus dados pelo período necessário para cumprir as finalidades descritas nesta
          Política ou conforme exigido por lei. Dados de conta são retidos enquanto o contrato estiver
          vigente e por até 5 anos após o encerramento, para fins legais.
        </P>
      </Section>

      <Section title="8. Segurança">
        <P>
          Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
          autorizado, alteração, divulgação ou destruição. Utilizamos criptografia em trânsito (TLS) e em
          repouso para dados sensíveis.
        </P>
      </Section>

      <Section title="9. Cookies">
        <P>
          Utilizamos cookies para melhorar sua experiência. Consulte nossa{' '}
          <a href="/cookies" className="text-royal-blue hover:underline">
            Política de Cookies
          </a>{' '}
          para mais detalhes.
        </P>
      </Section>

      <Section title="10. Alterações desta Política">
        <P>
          Podemos atualizar esta Política periodicamente. Notificaremos mudanças significativas por
          e-mail ou aviso na plataforma. A data de última atualização estará sempre indicada no topo
          desta página.
        </P>
      </Section>

      <Section title="11. Contato — Encarregado de Dados (DPO)">
        <P>
          Para questões relacionadas à privacidade e proteção de dados:{' '}
          <a href="mailto:adm.emplyon@gmail.com" className="text-royal-blue hover:underline">
            adm.emplyon@gmail.com
          </a>
          <br />
          Emplyon Systems — Av. Paulista, 1000 — São Paulo, SP
        </P>
      </Section>
    </LegalPage>
  );
}

export default PrivacyPage;
