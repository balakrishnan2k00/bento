export type IconName =
  | 'gmail'
  | 'keep'
  | 'drive'
  | 'amazonPhotos'
  | 'googlePhotos'
  | 'facebook'
  | 'yahoo'
  | 'linkedin'
  | 'reddit'
  | 'x'
  | 'youtube'
  | 'amazon'
  | 'espn'
  | 'prime'
  | 'netflix'
  | 'hulu'
  | 'crunchyroll'
  | 'tiktok'
  | 'disney'
  | 'spotify'
  | 'analytics'
  | 'notion'
  | 'figma'

export type Bookmark = {
  label: string
  href: string
  icon: IconName
}

export const profile = {
  name: 'Balakrishnan',
  address: 'Marina Skies Hyderabad, Telangana 500018, India',
  addressDisplay: ['HYDERABAD, TELANGANA, INDIA', '500018'],
  latitude: 17.465051,
  longitude: 78.408110,
}

export const fallbackQuote = {
  text: 'The best and most beautiful things in the world cannot be seen or even touched – they must be felt with the heart.',
  author: 'Helen Keller',
}

export const personal: Bookmark[] = [
  { label: 'Gmail', href: 'https://mail.google.com', icon: 'gmail' },
  { label: 'Google Keep', href: 'https://keep.google.com', icon: 'keep' },
  { label: 'Google Drive', href: 'https://drive.google.com', icon: 'drive' },
  { label: 'Amazon Photos', href: 'https://www.amazon.com/photos', icon: 'amazonPhotos' },
  { label: 'Google Photos', href: 'https://photos.google.com', icon: 'googlePhotos' },
  { label: 'FaceBook', href: 'https://www.facebook.com', icon: 'facebook' },
  { label: 'Yahoo Mail', href: 'https://mail.yahoo.com', icon: 'yahoo' },
]

export const favorites: Bookmark[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
  { label: 'Reddit', href: 'https://www.reddit.com', icon: 'reddit' },
  { label: 'X.com', href: 'https://x.com', icon: 'x' },
  { label: 'Youtube', href: 'https://www.youtube.com', icon: 'youtube' },
  { label: 'Amazon', href: 'https://www.amazon.com', icon: 'amazon' },
  { label: 'ESPN', href: 'https://www.espn.com', icon: 'espn' },
]

export const entertainment: Bookmark[] = [
  { label: 'Amazon Prime', href: 'https://www.primevideo.com', icon: 'prime' },
  { label: 'Netflix', href: 'https://www.netflix.com', icon: 'netflix' },
  { label: 'Hulu', href: 'https://www.hulu.com', icon: 'hulu' },
  { label: 'Crunchyroll', href: 'https://www.crunchyroll.com', icon: 'crunchyroll' },
  { label: 'TikTok', href: 'https://www.tiktok.com', icon: 'tiktok' },
  { label: 'Disney+', href: 'https://www.disneyplus.com', icon: 'disney' },
  { label: 'Spotify', href: 'https://open.spotify.com', icon: 'spotify' },
]

export const work: Bookmark[] = [
  { label: 'Google Analytics', href: 'https://analytics.google.com', icon: 'analytics' },
  { label: 'Notion', href: 'https://www.notion.so', icon: 'notion' },
  { label: 'Figma', href: 'https://www.figma.com', icon: 'figma' },
]
