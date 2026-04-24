import { LegalPage, Section, P, Ul } from './LegalPage';

export function TermsPage() {
  return (
    <LegalPage title="Termos de Uso" lastUpdated="24 de abril de 2026">
      <Section title="1. Aceitação dos Termos">
        <P>
          Ao acessar ou utilizar a plataforma <strong>Emplyon</strong>, você concorda com estes Termos de
          Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
        </P>
      </Section>

      <Section title="2. Descrição do Serviço">
        <P>
          A Emplyon é uma plataforma de gestão inteligente de escalas de trabalho que auxilia empresas a
          centralizar, automatizar e garantir conformidade legal nas jornadas de seus colaboradores.
        </P>
        <P>
          Os serviços incluem, mas não se limitam a:
        </P>
        <Ul items={[
          'Criação e gestão automatizada de escalas de trabalho',
          'Validação de conformidade com a CLT e convenções coletivas',
          'Relatórios e métricas operacionais',
          'Comunicação e notificações para equipes',
          'Integração com sistemas de folha de pagamento',
        ]} />
      </Section>

      <Section title="3. Uso Permitido">
        <P>Você concorda em utilizar a plataforma apenas para fins lícitos e de acordo com estes termos. É expressamente proibido:</P>
        <Ul items={[
          'Usar o serviço para fins ilegais ou não autorizados',
          'Tentar acessar áreas restritas do sistema sem autorização',
          'Compartilhar credenciais de acesso com terceiros não autorizados',
          'Reproduzir, duplicar ou copiar qualquer parte da plataforma sem permissão',
          'Realizar engenharia reversa ou decompilar o software',
        ]} />
      </Section>

      <Section title="4. Conta e Responsabilidade">
        <P>
          Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as
          atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não
          autorizado em <strong>adm.emplyon@gmail.com</strong>.
        </P>
      </Section>

      <Section title="5. Propriedade Intelectual">
        <P>
          Todo o conteúdo, funcionalidades e tecnologia da plataforma Emplyon são propriedade exclusiva
          da Emplyon Systems e protegidos por leis de direitos autorais, marcas registradas e demais leis
          de propriedade intelectual aplicáveis.
        </P>
      </Section>

      <Section title="6. Limitação de Responsabilidade">
        <P>
          A Emplyon não será responsável por danos indiretos, incidentais, especiais ou consequentes
          decorrentes do uso ou da impossibilidade de uso dos serviços. A plataforma é fornecida "no
          estado em que se encontra", sem garantias de qualquer natureza.
        </P>
      </Section>

      <Section title="7. Alterações dos Termos">
        <P>
          Reservamos o direito de modificar estes Termos a qualquer momento. As alterações entram em
          vigor imediatamente após a publicação. O uso continuado da plataforma após a publicação de
          alterações constitui aceitação dos novos termos.
        </P>
      </Section>

      <Section title="8. Lei Aplicável">
        <P>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
          Comarca de São Paulo - SP para dirimir quaisquer controvérsias.
        </P>
      </Section>

      <Section title="9. Contato">
        <P>
          Dúvidas sobre estes Termos de Uso podem ser enviadas para{' '}
          <a href="mailto:adm.emplyon@gmail.com" className="text-royal-blue hover:underline">
            adm.emplyon@gmail.com
          </a>.
        </P>
      </Section>
    </LegalPage>
  );
}

export default TermsPage;
