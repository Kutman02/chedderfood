export interface AboutHero {
  title: string
  subtitle: string
}

export interface AboutHistory {
  title: string
  paragraphs: string[]
}

export interface AboutAdvantageItem {
  icon: string
  title: string
  description: string
}

export interface AboutAdvantages {
  title: string
  items: AboutAdvantageItem[]
}

export interface AboutValueItem {
  title: string
  description: string
}

export interface AboutValues {
  title: string
  items: AboutValueItem[]
}

export interface AboutPageData {
  hero: AboutHero
  history: AboutHistory
  advantages: AboutAdvantages
  values: AboutValues
}

export interface AboutPageResponse {
  success: boolean
  data: AboutPageData
  message?: string
}

export interface AboutPageRequest {
  hero?: AboutHero
  history?: AboutHistory
  advantages?: AboutAdvantages
  values?: AboutValues
}