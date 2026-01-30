import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] pb-24">
      <Header title="Premium" showBack />

      <div className="px-4 py-4">
        {/* Hero */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">⭐</span>
          <h1 className="text-2xl font-bold text-white mb-2">Palpiteiro Premium</h1>
          <p className="text-[#a0a0b0]">Leve seus palpites para o próximo nível</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-start gap-4">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="text-white font-semibold text-sm">Estatísticas avançadas</h3>
              <p className="text-[#6b6b7b] text-xs mt-1">Análises detalhadas de cada rumor e influenciador</p>
            </div>
          </div>

          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-start gap-4">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="text-white font-semibold text-sm">Alertas em tempo real</h3>
              <p className="text-[#6b6b7b] text-xs mt-1">Seja o primeiro a saber quando um influenciador se manifestar</p>
            </div>
          </div>

          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-start gap-4">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="text-white font-semibold text-sm">Palpites ilimitados</h3>
              <p className="text-[#6b6b7b] text-xs mt-1">Sem limite de palpites por dia</p>
            </div>
          </div>

          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-start gap-4">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-white font-semibold text-sm">Badge exclusivo</h3>
              <p className="text-[#6b6b7b] text-xs mt-1">Destaque-se no ranking com o badge Premium</p>
            </div>
          </div>

          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-start gap-4">
            <span className="text-2xl">🚫</span>
            <div>
              <h3 className="text-white font-semibold text-sm">Sem anúncios</h3>
              <p className="text-[#6b6b7b] text-xs mt-1">Experiência 100% livre de interrupções</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-[#ff1744]/20 to-[#ff4444]/10 rounded-2xl border border-[#ff1744]/30 p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-[#6b6b7b] text-sm line-through">R$ 29,90/mês</span>
            <div className="text-white text-3xl font-bold">R$ 19,90<span className="text-sm font-normal text-[#a0a0b0]">/mês</span></div>
            <span className="inline-block mt-2 px-3 py-1 bg-[#00e676]/20 text-[#00e676] text-xs rounded-full">
              Economize 33%
            </span>
          </div>

          <Link
            href="/pagamento"
            className="block w-full py-4 bg-gradient-to-r from-[#ff1744] to-[#ff4444] text-white font-bold rounded-xl text-center neon-glow btn-press transition-all hover:opacity-90"
          >
            Assinar agora ⭐
          </Link>

          <p className="text-center text-[#6b6b7b] text-xs mt-3">
            Cancele quando quiser. Sem compromisso.
          </p>
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <p className="text-[#6b6b7b] text-xs">
            🔒 Pagamento seguro • 7 dias de garantia
          </p>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
