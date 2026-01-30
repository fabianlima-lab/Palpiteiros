import { prisma } from '@/lib/prisma'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { SocialPostCard } from '../components/SocialPostCard'

export default async function SocialPage() {
  const posts = await prisma.socialPost.findMany({
    include: {
      rumor: true,
    },
    orderBy: { postedAt: 'desc' },
    take: 20,
  })

  return (
    <main className="min-h-screen bg-[#0f0f1a] pb-24">
      <Header title="Social" />

      <div className="px-4 py-4">
        {/* Platform Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          <button className="px-4 py-2 bg-[#ff1744]/20 text-[#ff1744] border border-[#ff1744]/30 rounded-full text-sm font-medium shrink-0">
            Todos
          </button>
          <button className="px-4 py-2 bg-[#16162a] text-[#6b6b7b] border border-[#2a2a3e] rounded-full text-sm font-medium shrink-0">
            𝕏 Twitter
          </button>
          <button className="px-4 py-2 bg-[#16162a] text-[#6b6b7b] border border-[#2a2a3e] rounded-full text-sm font-medium shrink-0">
            ▶️ YouTube
          </button>
          <button className="px-4 py-2 bg-[#16162a] text-[#6b6b7b] border border-[#2a2a3e] rounded-full text-sm font-medium shrink-0">
            🎵 TikTok
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id}>
              <SocialPostCard
                platform={post.platform}
                author={post.author}
                username={post.username}
                content={post.content}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                postedAt={post.postedAt}
              />
              {post.rumor && (
                <a
                  href={`/rumor/${post.rumor.id}`}
                  className="block mt-2 ml-4 px-3 py-2 bg-[#0f0f1a] rounded-lg border border-[#2a2a3e] text-xs"
                >
                  <span className="text-[#6b6b7b]">Sobre: </span>
                  <span className="text-[#ff1744]">{post.rumor.title}</span>
                </a>
              )}
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-[#6b6b7b]">Nenhum post ainda</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
