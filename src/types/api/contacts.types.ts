export interface ContactsHero {
  title: string
  subtitle: string
}

export interface ContactsPhone {
  number: string
  note: string
}

export interface ContactsEmail {
  address: string
  note: string
}

export interface ContactsAddress {
  street: string
  city: string
}

export interface ContactsWorkingHours {
  days: string
  hours: string
}

export interface ContactsInfoSection {
  section_title: string
  section_description: string
  phone: ContactsPhone
  email: ContactsEmail
  address: ContactsAddress
  working_hours: ContactsWorkingHours
}

export interface ContactsMessengers {
  whatsapp: string
  telegram: string
}

export interface ContactsLocation {
  title: string
  street: string
  city: string
  directions_text: string
  google_maps_embed_url: string
}

export interface ContactsPageData {
  hero: ContactsHero
  contact_info: ContactsInfoSection
  messengers: ContactsMessengers
  location: ContactsLocation
}

export interface ContactsPageResponse {
  success: boolean
  data: ContactsPageData
  message?: string
}

export interface ContactsPageRequest {
  hero?: ContactsHero
  contact_info?: ContactsInfoSection
  messengers?: ContactsMessengers
  location?: ContactsLocation
}