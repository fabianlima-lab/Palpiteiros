import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
      predictions: {
        include: {
          rumor: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] pb-24">
      <Header title="Usuário" showBack />

      <div className="px-4 py-4">
        {/* Profile Header */}
        <div className="bg-[#16162a] rounded-2xl border border-[#2a2a3e] p-6 mb-4 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            {user.isPremium && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#ffab00] rounded-full flex items-center justify-center text-lg">
                ⭐
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-[#6b6b7b] text-sm mb-3">@{user.username}</p>

          {user.team && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff1744]/10 border border-[#ff1744]/30 rounded-full text-[#ff1744] text-sm mb-4">
              ❤️ {user.team}
            </div>
          )}

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {user.badges.map((ub) => (
                <div
                  key={ub.id}
                  className="px-3 py-2 bg-[#1a1a2e] rounded-lg flex items-center gap-2"
                  title={ub.badge.description}
                >
                  <span>{ub.badge.emoji}</span>
                  <span className="text-white text-xs">{ub.badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 text-center">
            <div className="text-2xl font-bold text-[#ffab00]">{user.points.toLocaleString()}</div>
            <p className="text-[#6b6b7b] text-xs mt-1">Pontos</p>
          </div>
          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 text-center">
            <div className="text-2xl font-bold text-white">{user.level}</div>
            <p className="text-[#6b6b7b] text-xs mt-1">Nível</p>
          </div>
          <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 text-center">
            <div className="text-2xl font-bold text-white">{user.predictions.length}</div>
            <p className="text-[#6b6b7b] text-xs mt-1">Palpites</p>
          </div>
        </div>

        {/* Recent Predictions */}
        <div>
          <h2 className="text-sm font-semibold text-[#a0a0b0] mb-3">🎯 Últimos palpites</h2>
          <div className="space-y-2">
            {user.predictions.map((prediction) => (
              <Link
                key={prediction.id}
                href={`/rumor/${prediction.rumor.id}`}
                className="flex items-center justify-between bg-[#16162a] rounded-xl border border-[#2a2a3e] p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{prediction.rumor.title}</p>
                  <p className="text-[#6b6b7b] text-xs">
                    {new Date(prediction.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  prediction.prediction
                    ? 'bg-[#00e676]/20 text-[#00e676]'
                    : 'bg-[#ff1744]/20 text-[#ff1744]'
                }`}>
                  {prediction.prediction ? '👍' : '👎'}
                </span>
              </Link>
            ))}

            {user.predictions.length === 0 && (
              <div className="text-center py-8 text-[#6b6b7b]">
                <span className="text-2xl block mb-2">🎯</span>
                Nenhum palpite ainda
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
