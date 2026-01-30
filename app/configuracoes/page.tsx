import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default function ConfiguracoesPage() {
  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Configurações" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Account Section */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          👤 CONTA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <Link href="/perfil" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Editar perfil</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>❤️</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Time do coração</span>
            </div>
            <span style={{ color: '#ff1744', fontSize: '14px' }}>Flamengo</span>
          </div>

          <Link href="/assinatura" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⭐</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Assinatura Premium</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>
        </div>

        {/* Notifications Section */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🔔 NOTIFICAÇÕES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>🚨</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Novos sinais</span>
            </div>
            <div style={{
              width: '48px',
              height: '28px',
              background: '#ff1744',
              borderRadius: '14px',
              padding: '2px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: 'white',
                borderRadius: '50%',
                marginLeft: 'auto'
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Mudanças de sentimento</span>
            </div>
            <div style={{
              width: '48px',
              height: '28px',
              background: '#ff1744',
              borderRadius: '14px',
              padding: '2px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: 'white',
                borderRadius: '50%',
                marginLeft: 'auto'
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>✅</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Resultados</span>
            </div>
            <div style={{
              width: '48px',
              height: '28px',
              background: '#ff1744',
              borderRadius: '14px',
              padding: '2px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: 'white',
                borderRadius: '50%',
                marginLeft: 'auto'
              }} />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          ℹ️ SOBRE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <Link href="/faq" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>❓</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Perguntas frequentes</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/politicas" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📜</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Políticas e Termos</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📱</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Versão</span>
            </div>
            <span style={{ color: '#666680', fontSize: '14px' }}>1.0.0</span>
          </div>
        </div>

        {/* Logout */}
        <button style={{
          width: '100%',
          padding: '16px',
          background: 'transparent',
          border: '1px solid #ff1744',
          borderRadius: '14px',
          color: '#ff1744',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Sair da conta
        </button>
      </div>

      <BottomNav />
    </main>
  )
}
