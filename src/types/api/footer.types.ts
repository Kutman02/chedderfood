export interface FooterLink {
  label: string
  url: string
}

export interface CompanyInfo {
  title: string
  description?: string
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
}

export interface BottomInfo {
  copyrightText?: string
  versionText?: string
  countryText?: string
}

export interface SiteFooterData {
  company: CompanyInfo
  contacts: ContactInfo
  links: FooterLink[]
  bottom: BottomInfo
}

export interface SiteFooterResponse {
  success: boolean
  data: SiteFooterData
  message?: string
}

export interface SiteFooterRequest {
  company?: CompanyInfo
  contacts?: ContactInfo
  links?: FooterLink[]
  bottom?: BottomInfo
}
