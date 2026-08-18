export interface WildlifeSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'mammal' | 'bird' | 'reptile' | 'flora' | 'poaching_evidence';
  iucnStatus: 'Critically Endangered' | 'Endangered' | 'Vulnerable' | 'Near Threatened' | 'Protected Flora';
  habitat: string;
  trackDescription: string;
  keyIdentification: string;
  threatFactors: string;
  emergencyProtocol: string;
  iconEmoji: string;
}

export const WILDLIFE_CATALOG: WildlifeSpecies[] = [
  {
    id: 'sp_tiger',
    commonName: 'Royal Bengal Tiger / Puma',
    scientificName: 'Panthera tigris / Puma concolor',
    category: 'mammal',
    iucnStatus: 'Endangered',
    habitat: 'Dense Canopy, Riparian Corridors, Ridge Tops',
    trackDescription: 'Round pad with 4 asymmetrical toe pads, no claw marks showing (retractable claws). Girth 12-15cm width.',
    keyIdentification: 'Orange-red coat with dark vertical stripes, distinctive facial markings, tail with black rings.',
    threatFactors: 'Poaching snares, retaliatory livestock poisoning, habitat fragmentation.',
    emergencyProtocol: 'Maintain min 50m distance, notify Range HQ VHF Channel 16, log pugmark GPS coordinates immediately.',
    iconEmoji: '🐅'
  },
  {
    id: 'sp_elephant',
    commonName: 'Asian / Forest Elephant',
    scientificName: 'Elephas maximus',
    category: 'mammal',
    iucnStatus: 'Endangered',
    habitat: 'Deciduous forest, Bamboo thickets, Grasslands',
    trackDescription: 'Circular front footprint (38-45cm diam), oval rear footprint. Girth x 2 ≈ shoulder height.',
    keyIdentification: 'Arched back, prominent forehead with two humps, grey wrinkly skin, distinctive trunk and tusks/tushes.',
    threatFactors: 'Electric fencing, train collisions, ivory poaching, human-elephant conflict.',
    emergencyProtocol: 'Never block migration corridor; alert nearby village watchmen; stay upwind.',
    iconEmoji: '🐘'
  },
  {
    id: 'sp_pangolin',
    commonName: 'Indian / Chinese Pangolin',
    scientificName: 'Manis crassicaudata',
    category: 'mammal',
    iucnStatus: 'Critically Endangered',
    habitat: 'Burrows in slopes, dry to moist forests',
    trackDescription: 'Characteristic tail-drag mark in sand with 5 curved claw prints.',
    keyIdentification: 'Overlapping keratin scales covering entire body except belly; rolls into a tight sphere when threatened.',
    threatFactors: 'Highest trafficked mammal worldwide; hunted for scales and meat.',
    emergencyProtocol: 'If found in snare, carefully free with kevlar gloves; log seizure report in offline app.',
    iconEmoji: '🦔'
  },
  {
    id: 'sp_sandalwood',
    commonName: 'Red Sandalwood / Rosewood',
    scientificName: 'Pterocarpus santalinus',
    category: 'flora',
    iucnStatus: 'Protected Flora',
    habitat: 'Rocky dry deciduous hills, quartzite soils',
    trackDescription: 'Bark dark brown to blackish, deeply cleft into rectangular plates with red resin exudes when slashed.',
    keyIdentification: 'Dense, extremely heavy deep red heartwood; pinnate leaves with 3-5 ovate leaflets.',
    threatFactors: 'Illicit felling by organized syndicates, illegal road transit.',
    emergencyProtocol: 'Mark stump with forest hammer; calculate girth; issue immediate FIR seizure memo.',
    iconEmoji: '🪵'
  },
  {
    id: 'sp_snare_wire',
    commonName: 'Clutch Wire Loop Poaching Snare',
    scientificName: 'Anthropogenic Poaching Device',
    category: 'poaching_evidence',
    iucnStatus: 'Critically Endangered',
    habitat: 'Animal trails, waterhole approaches, salt licks',
    trackDescription: 'Tethered high-tensile clutch cable anchored to sapling with slipknot loop positioned 30-50cm above ground.',
    keyIdentification: 'Concealed under dried leaves along game paths; shiny steel cable reflections under flashlight.',
    threatFactors: 'Indiscriminate killing of leopards, tigers, ungulates; slow agonizing mortality.',
    emergencyProtocol: 'Disable trigger mechanism; preserve for fingerprint audit; sweep 200m perimeter for additional snares.',
    iconEmoji: '🪤'
  },
  {
    id: 'sp_hornbill',
    commonName: 'Great Hornbill',
    scientificName: 'Buceros bicornis',
    category: 'bird',
    iucnStatus: 'Vulnerable',
    habitat: 'Mature old-growth rainforest with hollow nesting trees',
    trackDescription: 'Zygodactyl perching footprints on muddy riverbanks; distinctive wing whooshing acoustic sound in flight.',
    keyIdentification: 'Massive yellow and black casque on top of bill; broad black band on white tail.',
    threatFactors: 'Felling of ancient nesting trees, feather and casque hunting.',
    emergencyProtocol: 'Record GPS coordinate of active nest cavity; mark tree as Grade 1 Protected Nest Tree.',
    iconEmoji: '🦜'
  }
];
