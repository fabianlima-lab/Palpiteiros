import Link from 'next/link'

export default function ConfirmacaoPage() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#00e676] to-[#69f0ae] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Parabéns! 🎉</h1>
        <p className="text-[#a0a0b0] mb-8">Você agora é Premium!</p>

        {/* Benefits */}
        <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 mb-8 text-left">
          <h3 className="text-white font-semibold text-sm mb-3">Seus benefícios estão ativos:</h3>
          <div className="space-y-2 text-[#a0a0b0] text-sm">
            <p>✅ Estatísticas avançadas</p>
            <p>✅ Alertas em tempo real</p>
            <p>✅ Palpites ilimitados</p>
            <p>✅ Badge Premium</p>
            <p>✅ Sem anúncios</p>
          </div>
        </div>

        <Link
          href="/home"
          className="block w-full py-4 bg-gradient-to-r from-[#ff1744] to-[#ff4444] text-white font-bold rounded-xl text-center neon-glow btn-press transition-all hover:opacity-90"
        >
          Começar a usar ⭐
        </Link>
      </div>
    </main>
  )
}
