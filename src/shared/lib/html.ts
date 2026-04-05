export const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

export const stripHtml = (html: string): string => {
  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText || ""
}