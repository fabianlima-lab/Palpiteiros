import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default function PoliticasPage() {
  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Políticas" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Terms of Use */}
          <section>
            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>📜 Termos de Uso</h2>
            <div style={{
              backgroundColor: '#16162a',
              borderRadius: '12px',
              border: '1px solid #2a2a3e',
              padding: '16px',
              color: '#a0a0b0',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <p style={{ marginBottom: '12px' }}>
                Bem-vindo ao Palpiteiro! Ao usar nosso aplicativo, você concorda com estes termos.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>1. Uso do Serviço</strong><br />
                O Palpiteiro é uma plataforma de entretenimento para acompanhamento de rumores de transferências do futebol brasileiro. Não somos uma casa de apostas e não oferecemos prêmios em dinheiro.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>2. Conta do Usuário</strong><br />
                Você é responsável por manter a segurança de sua conta e por todas as atividades realizadas nela.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>3. Conteúdo</strong><br />
                Os rumores e sinais apresentados são baseados em fontes públicas e opiniões de influenciadores. Não garantimos a veracidade das informações.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#fff' }}>4. Assinatura Premium</strong><br />
                A assinatura é renovada automaticamente. Você pode cancelar a qualquer momento através das configurações.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>🔒 Política de Privacidade</h2>
            <div style={{
              backgroundColor: '#16162a',
              borderRadius: '12px',
              border: '1px solid #2a2a3e',
              padding: '16px',
              color: '#a0a0b0',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>Dados coletados</strong><br />
                Coletamos informações que você fornece (nome, e-mail, time preferido) e dados de uso do aplicativo.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>Uso dos dados</strong><br />
                Usamos seus dados para personalizar sua experiência, enviar notificações e melhorar nossos serviços.
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>Compartilhamento</strong><br />
                Não vendemos seus dados. Podemos compartilhar informações agregadas e anônimas para fins estatísticos.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#fff' }}>Seus direitos</strong><br />
                Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>📧 Contato</h2>
            <div style={{
              backgroundColor: '#16162a',
              borderRadius: '12px',
              border: '1px solid #2a2a3e',
              padding: '16px',
              color: '#a0a0b0',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <p style={{ margin: 0 }}>
                Dúvidas ou sugestões? Entre em contato:<br />
                <span style={{ color: '#ff1744' }}>contato@palpiteiro.com</span>
              </p>
            </div>
          </section>
        </div>

        <p style={{ textAlign: 'center', color: '#666680', fontSize: '11px', marginTop: '24px' }}>
          Última atualização: Janeiro de 2025
        </p>
      </div>

      <BottomNav />
    </main>
  )
}
