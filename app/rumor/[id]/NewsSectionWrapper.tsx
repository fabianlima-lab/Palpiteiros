'use client'

import { NewsSection } from '../../components/NewsItemCard'

interface NewsSectionWrapperProps {
  rumorId: string
}

export function NewsSectionWrapper({ rumorId }: NewsSectionWrapperProps) {
  return <NewsSection rumorId={rumorId} />
}
