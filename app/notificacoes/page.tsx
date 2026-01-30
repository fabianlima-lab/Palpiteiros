import { prisma } from '@/lib/prisma'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default async function NotificacoesPage() {
  const demoUser = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
  })

  const notifications = demoUser
    ? await prisma.notification.findMany({
        where: { userId: demoUser.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const getIcon = (type: string) => {
    switch (type) {
      case 'signal': return '🚨'
      case 'rumor': return '📊'
      case 'result': return '✅'
      case 'badge': return '🏅'
      default: return '🔔'
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] pb-24">
      <Header title="Notificações" showBack />

      <div className="px-4 py-4">
        {/* Mark all as read */}
        {notifications.some(n => !n.read) && (
          <button className="w-full text-center text-[#ff1744] text-sm py-2 mb-4">
            Marcar todas como lidas
          </button>
        )}

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border ${
                notification.read
                  ? 'bg-[#16162a] border-[#2a2a3e]'
                  : 'bg-[#ff1744]/5 border-[#ff1744]/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIcon(notification.type)}</span>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{notification.title}</h3>
                  <p className="text-[#a0a0b0] text-sm mt-1">{notification.message}</p>
                  <p className="text-[#6b6b7b] text-xs mt-2">
                    {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-[#ff1744] rounded-full shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🔕</span>
              <p className="text-[#6b6b7b]">Nenhuma notificação</p>
              <p className="text-[#6b6b7b] text-sm mt-1">Você será avisado sobre novidades</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
