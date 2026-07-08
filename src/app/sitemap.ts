// src/app/sitemap.ts

// src/app/sitemap.ts
// Vai trò: Tạo sitemap cho SEO

import { MetadataRoute } from 'next'

// Định nghĩa các route tĩnh
const staticRoutes = [
  {
    url: '',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: '/about',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    url: '/dashboard',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  },
  {
    url: '/documents',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: '/lectures',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: '/schedule',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    url: '/exams',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/assignments',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    url: '/submissions',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/forum',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    url: '/software',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/iso',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/vm',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/packet-tracer',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/cisco-lab',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/linux',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/windows-server',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/docker',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/python',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/network-automation',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  },
  {
    url: '/projects',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/source-code',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/profile',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: '/faq',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: '/contact',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: '/terms',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  },
  {
    url: '/login',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  },
  {
    url: '/register',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qtm3k14.vercel.app'

  // Tạo sitemap từ danh sách route tĩnh
  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return staticSitemap
}