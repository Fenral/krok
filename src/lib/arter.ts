export type Habitat = 'ferskvann' | 'saltvann'

export type Art = {
  id: string
  norsk: string
  latin: string
  habitat: Habitat
  minstemaal?: string
}

export const arter: Art[] = [
  { id: 'orret', norsk: 'Ørret', latin: 'Salmo trutta', habitat: 'ferskvann', minstemaal: '25 cm (varierer)' },
  { id: 'roye', norsk: 'Røye', latin: 'Salvelinus alpinus', habitat: 'ferskvann', minstemaal: 'Ingen nasjonal' },
  { id: 'harr', norsk: 'Harr', latin: 'Thymallus thymallus', habitat: 'ferskvann', minstemaal: '30 cm' },
  { id: 'abbor', norsk: 'Abbor', latin: 'Perca fluviatilis', habitat: 'ferskvann' },
  { id: 'gjedde', norsk: 'Gjedde', latin: 'Esox lucius', habitat: 'ferskvann' },
  { id: 'sik', norsk: 'Sik', latin: 'Coregonus lavaretus', habitat: 'ferskvann' },
  { id: 'laks', norsk: 'Laks', latin: 'Salmo salar', habitat: 'ferskvann', minstemaal: '35 cm (varierer)' },
  { id: 'sjoorret', norsk: 'Sjøørret', latin: 'Salmo trutta trutta', habitat: 'saltvann', minstemaal: '35 cm' },
  { id: 'makrell', norsk: 'Makrell', latin: 'Scomber scombrus', habitat: 'saltvann', minstemaal: '20 cm' },
  { id: 'torsk', norsk: 'Torsk', latin: 'Gadus morhua', habitat: 'saltvann', minstemaal: '40 cm' },
  { id: 'sei', norsk: 'Sei', latin: 'Pollachius virens', habitat: 'saltvann' },
  { id: 'lyr', norsk: 'Lyr', latin: 'Pollachius pollachius', habitat: 'saltvann' },
  { id: 'hyse', norsk: 'Hyse', latin: 'Melanogrammus aeglefinus', habitat: 'saltvann', minstemaal: '40 cm' },
  { id: 'kveite', norsk: 'Kveite', latin: 'Hippoglossus hippoglossus', habitat: 'saltvann', minstemaal: '80 cm' },
  { id: 'flyndre', norsk: 'Rødspette', latin: 'Pleuronectes platessa', habitat: 'saltvann', minstemaal: '27 cm' },
  { id: 'mort', norsk: 'Mort', latin: 'Rutilus rutilus', habitat: 'ferskvann' },
  { id: 'brasme', norsk: 'Brasme', latin: 'Abramis brama', habitat: 'ferskvann' },
  { id: 'gjorse', norsk: 'Gjørs', latin: 'Sander lucioperca', habitat: 'ferskvann' },
]

export type HabitatFilter = 'alle' | Habitat
