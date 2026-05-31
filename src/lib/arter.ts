export type Habitat = 'ferskvann' | 'saltvann'

/**
 * Shape-token: avgjør hvilken SVG-silhuett som rendres i ArtSilhouette.
 * Vi differensierer på faktiske silhuett-familier (ikke alle 17 arter trenger
 * unik tegning) — laksefisk, gjedde-langform, flatfisk, pigget abbor-form,
 * torskefisk og karpefisk dekker visuelt 95% av norske ferskvanns- og
 * saltvannsarter.
 */
export type ArtShape =
  | 'salmonid' // ørret, røye, harr, laks, sjøørret, sik
  | 'pike' // gjedde
  | 'perch' // abbor, gjørs
  | 'cod' // torsk, sei, lyr, hyse
  | 'mackerel' // makrell
  | 'flatfish' // kveite, rødspette
  | 'cyprinid' // mort, brasme

export type MinstemaalKind = 'fast' | 'varierer' | 'ingen'

export type Art = {
  id: string
  norsk: string
  latin: string
  habitat: Habitat
  shape: ArtShape
  /** Visuell minstemål-streng — alltid synlig i UI. */
  minstemaal: string
  /** Hva slags regulering. Brukes til ikon/copy-variasjon. */
  minstemaalKind: MinstemaalKind
  /** Norsk fredningstid (kort form) — eller null hvis ingen nasjonal. */
  fredning: string | null
}

export const arter: Art[] = [
  {
    id: 'orret',
    norsk: 'Ørret',
    latin: 'Salmo trutta',
    habitat: 'ferskvann',
    shape: 'salmonid',
    minstemaal: '25 cm',
    minstemaalKind: 'varierer',
    fredning: '15.9 – 15.4',
  },
  {
    id: 'roye',
    norsk: 'Røye',
    latin: 'Salvelinus alpinus',
    habitat: 'ferskvann',
    shape: 'salmonid',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'harr',
    norsk: 'Harr',
    latin: 'Thymallus thymallus',
    habitat: 'ferskvann',
    shape: 'salmonid',
    minstemaal: '30 cm',
    minstemaalKind: 'fast',
    fredning: '1.4 – 31.5',
  },
  {
    id: 'abbor',
    norsk: 'Abbor',
    latin: 'Perca fluviatilis',
    habitat: 'ferskvann',
    shape: 'perch',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'gjedde',
    norsk: 'Gjedde',
    latin: 'Esox lucius',
    habitat: 'ferskvann',
    shape: 'pike',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'sik',
    norsk: 'Sik',
    latin: 'Coregonus lavaretus',
    habitat: 'ferskvann',
    shape: 'salmonid',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'laks',
    norsk: 'Laks',
    latin: 'Salmo salar',
    habitat: 'ferskvann',
    shape: 'salmonid',
    minstemaal: '35 cm',
    minstemaalKind: 'varierer',
    fredning: '1.9 – 31.5',
  },
  {
    id: 'sjoorret',
    norsk: 'Sjøørret',
    latin: 'Salmo trutta trutta',
    habitat: 'saltvann',
    shape: 'salmonid',
    minstemaal: '35 cm',
    minstemaalKind: 'fast',
    fredning: '15.9 – 31.3',
  },
  {
    id: 'makrell',
    norsk: 'Makrell',
    latin: 'Scomber scombrus',
    habitat: 'saltvann',
    shape: 'mackerel',
    minstemaal: '20 cm',
    minstemaalKind: 'fast',
    fredning: null,
  },
  {
    id: 'torsk',
    norsk: 'Torsk',
    latin: 'Gadus morhua',
    habitat: 'saltvann',
    shape: 'cod',
    minstemaal: '40 cm',
    minstemaalKind: 'fast',
    fredning: null,
  },
  {
    id: 'sei',
    norsk: 'Sei',
    latin: 'Pollachius virens',
    habitat: 'saltvann',
    shape: 'cod',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'lyr',
    norsk: 'Lyr',
    latin: 'Pollachius pollachius',
    habitat: 'saltvann',
    shape: 'cod',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'hyse',
    norsk: 'Hyse',
    latin: 'Melanogrammus aeglefinus',
    habitat: 'saltvann',
    shape: 'cod',
    minstemaal: '40 cm',
    minstemaalKind: 'fast',
    fredning: null,
  },
  {
    id: 'kveite',
    norsk: 'Kveite',
    latin: 'Hippoglossus hippoglossus',
    habitat: 'saltvann',
    shape: 'flatfish',
    minstemaal: '80 cm',
    minstemaalKind: 'fast',
    fredning: '20.12 – 31.3',
  },
  {
    id: 'flyndre',
    norsk: 'Rødspette',
    latin: 'Pleuronectes platessa',
    habitat: 'saltvann',
    shape: 'flatfish',
    minstemaal: '27 cm',
    minstemaalKind: 'fast',
    fredning: null,
  },
  {
    id: 'mort',
    norsk: 'Mort',
    latin: 'Rutilus rutilus',
    habitat: 'ferskvann',
    shape: 'cyprinid',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'brasme',
    norsk: 'Brasme',
    latin: 'Abramis brama',
    habitat: 'ferskvann',
    shape: 'cyprinid',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
  {
    id: 'gjorse',
    norsk: 'Gjørs',
    latin: 'Sander lucioperca',
    habitat: 'ferskvann',
    shape: 'perch',
    minstemaal: 'Ingen minstemål',
    minstemaalKind: 'ingen',
    fredning: null,
  },
]

export type HabitatFilter = 'alle' | Habitat
