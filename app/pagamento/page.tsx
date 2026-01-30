'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '../components/Header'

export default function PagamentoPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      router.push('/pagamento/confirmacao')
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a]">
      <Header title="Pagamento" showBack />

      <div className="px-4 py-4">
        {/* Order Summary */}
        <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 mb-6">
          <h2 className="text-white font-semibold mb-4">Resumo do pedido</h2>
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a3e]">
            <span className="text-[#a0a0b0]">Palpiteiro Premium</span>
            <span className="text-white">R$ 19,90/mês</span>
          </div>
          <div className="flex items-center justify-between py-2 mt-2">
            <span className="text-white font-semibold">Total</span>
            <span className="text-[#ff1744] font-bold text-xl">R$ 19,90</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Método de pagamento</h2>
          <div className="space-y-3">
            <button className="w-full bg-[#16162a] rounded-xl border-2 border-[#ff1744] p-4 flex items-center gap-4">
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="text-white font-medium">Cartão de crédito</p>
                <p className="text-[#6b6b7b] text-xs">Visa, Mastercard, Elo</p>
              </div>
              <div className="ml-auto w-5 h-5 bg-[#ff1744] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </button>

            <button className="w-full bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 flex items-center gap-4 opacity-50">
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <p className="text-white font-medium">PIX</p>
                <p className="text-[#6b6b7b] text-xs">Em breve</p>
              </div>
            </button>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-[#a0a0b0] text-xs mb-2 block">Número do cartão</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b6b7b] text-sm focus:outline-none focus:border-[#ff1744]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#a0a0b0] text-xs mb-2 block">Validade</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b6b7b] text-sm focus:outline-none focus:border-[#ff1744]"
                />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs mb-2 block">CVV</label>
                <input
                  type="text"
                  placeholder="000"
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b6b7b] text-sm focus:outline-none focus:border-[#ff1744]"
                />
              </div>
            </div>
            <div>
              <label className="text-[#a0a0b0] text-xs mb-2 block">Nome no cartão</label>
              <input
                type="text"
                placeholder="Como está no cartão"
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg py-3 px-4 text-white placeholder-[#6b6b7b] text-sm focus:outline-none focus:border-[#ff1744]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-[#ff1744] to-[#ff4444] text-white font-bold rounded-xl text-center neon-glow btn-press transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? 'Processando...' : 'Confirmar pagamento'}
        </button>

        <p className="text-center text-[#6b6b7b] text-xs mt-4">
          🔒 Seus dados estão seguros e criptografados
        </p>
      </div>
    </main>
  )
}
