export interface Country {
  code: string;
  name: string;
  digits: number;
  flag: string;
}

export const CIS_COUNTRIES: Country[] = [
  {
    code: "+996",
    name: "Кыргызстан",
    digits: 9,
    flag: "🇰🇬",
  },
];