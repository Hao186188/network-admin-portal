// src/app/sitemap/documents/sitemap.ts
// Vai trò: Sitemap cho trang documents

import { MetadataRoute } from 'next'
import { supabase } from '@/lib/db/supabase-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qtm3k14.vercel.app'

  try {
    const { data: documents } = await supabase
      .from('documents')
      .select('id, updated_at, title')
      .order('updated_at', { ascending: false })

    return documents?.map((doc) => ({
      url: `${baseUrl}/documents/${doc.id}`,
      lastModified: new Date(doc.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []
  } catch (error) {
    return []
  }
}