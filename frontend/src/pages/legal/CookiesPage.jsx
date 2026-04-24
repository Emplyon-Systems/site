import { LegalPage, Section, P, Ul } from './LegalPage';

const cookieTable = [
  { name: 'emplyon_cookie_consent', type: 'Essencial', duration: '1 ano', purpose: 'Guarda a preferência de consentimento de cookies do usuário.' },
  { name: '_ga, _gid', type: 'Analytics', duration: '2 anos / 24 h', purpose: 'Google Analytics — mede visitas e comportamento de navegação de forma anônima.' },
  { name: 'sb-*', type: 'Funcional', duration: 'Sessão', purpose: 'Supabase — autenticação e sessão do usuário na plataforma.' },
];

export function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      path="/cookies"
      lastUpdated="24 de abril de 2026"
      seoDescription="Política de cookies Emplyon: tipos de cookies, finalidades, consentimento e como gerir preferências no navegador."
    >
      <Section title="1. O que são Cookies?">
        <P>
          Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um
          site. Eles permitem que o site reconheça o seu dispositivo em visitas futuras e melhore a
          sua experiência de navegação.
        </P>
      </Section>

      <Section title="2. Como Usamos Cookies">
        <P>A Emplyon utiliza cookies para as seguintes finalidades:</P>
        <Ul items={[
          'Essenciais — necessários para o funcionamento básico do site e da plataforma',
          'Funcionais — lembram suas preferências e personalizam a experiência',
          'Analytics — nos ajudam a entender como os usuários interagem com o site (dados anônimos)',
          'Marketing — veiculação de anúncios relevantes (apenas com consentimento explícito)',
        ]} />
      </Section>

      <Section title="3. Cookies que Utilizamos">
        <P>Abaixo estão os principais cookies utilizados:</P>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Cookie</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Duração</th>
                <th className="px-4 py-3 font-semibold">Finalidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cookieTable.map((c) => (
                <tr key={c.name} className="bg-white">
                  <td className="px-4 py-3 font-mono text-xs text-royal-blue">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.type}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.duration}</td>
                  <td className="px-4 py-3 text-gray-600">{c.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Gerenciar Preferências">
        <P>
          Você pode gerenciar ou desativar cookies a qualquer momento pelas configurações do seu
          navegador. Note que desativar cookies essenciais pode impactar o funcionamento da plataforma.
        </P>
        <P>Principais navegadores:</P>
        <Ul items={[
          'Chrome: Configurações → Privacidade e Segurança → Cookies',
          'Firefox: Preferências → Privacidade e Segurança',
          'Safari: Preferências → Privacidade',
          'Edge: Configurações → Cookies e permissões do site',
        ]} />
      </Section>

      <Section title="5. Cookies de Terceiros">
        <P>
          Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas (ex:
          Google Analytics). Esses terceiros têm suas próprias políticas de privacidade, sobre as quais
          não temos controle.
        </P>
      </Section>

      <Section title="6. Consentimento">
        <P>
          Ao utilizar o site pela primeira vez, apresentamos um aviso de cookies. Você pode aceitar
          todos os cookies, aceitar apenas os essenciais ou personalizar suas preferências. Sua escolha
          é salva e pode ser alterada a qualquer momento nas configurações do navegador ou entrando em
          contato conosco.
        </P>
      </Section>

      <Section title="7. Contato">
        <P>
          Dúvidas sobre nossa Política de Cookies:{' '}
          <a href="mailto:adm.emplyon@gmail.com" className="text-royal-blue hover:underline">
            adm.emplyon@gmail.com
          </a>
        </P>
      </Section>
    </LegalPage>
  );
}

export default CookiesPage;
