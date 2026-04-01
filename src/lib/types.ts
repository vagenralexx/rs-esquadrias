export type Role = 'master' | 'editor' | 'viewer'

export interface Profile {
  id: string
  email: string
  name: string
  role: Role
  created_at: string
}

export interface SiteConfig {
  id: string
  key: string
  value: string
}

export interface PortfolioItem {
  id: string
  title: string
  category: string
  image_url: string
  order: number
  created_at: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  service: string
  message: string
  source: string
  status: 'new' | 'saved' | 'archived'
  notes: string
  created_at: string
}

export interface Review {
  id: string
  author_name: string
  rating: number
  body: string
  order: number
  active: boolean
  created_at: string
}
