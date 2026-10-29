export type IconName =
  | 'gmail'
  | 'icloud'
  | 'drive'
  | 'netflix'
  | 'kisskh'
  | 'prime'
  | 'hotstar'
  | 'sunnxt'
  | 'appletv'
  | 'youtube'
  | 'spotify'
  | 'applemusic'
  | 'chatgpt'
  | 'qwen'
  | 'claude'
  | 'github'
  | 'notion'
  | 'naukri'
  | 'telegram'
  | 'linkedin'
  | 'instagram'
  | 'whatsapp'
  | 'reddit'
  | 'amazon'
  | 'flipkart'
  | 'piratebay'

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

/** Mail, cloud, AI */
export const personal: Bookmark[] = [
  { label: 'Gmail', href: 'https://mail.google.com/mail/u/0/#inbox', icon: 'gmail' },
  { label: 'iCloud', href: 'https://www.icloud.com/', icon: 'icloud' },
  { label: 'OneDrive', href: 'https://onedrive.live.com/', icon: 'drive' },
  { label: 'ChatGPT', href: 'https://chatgpt.com/', icon: 'chatgpt' },
  { label: 'Qwen', href: 'https://chat.qwen.ai/', icon: 'qwen' },
  { label: 'Claude', href: 'https://claude.ai/new', icon: 'claude' },
]

/** Playlists (top of Favorites column) */
export const playlists: Bookmark[] = [
  { label: 'Spotify', href: 'https://open.spotify.com/', icon: 'spotify' },
  { label: 'Apple Music', href: 'https://music.apple.com/', icon: 'applemusic' },
]

const favoritesSocial: Bookmark[] = [
  { label: 'Telegram', href: 'https://web.telegram.org/k/', icon: 'telegram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  { label: 'WhatsApp', href: 'https://web.whatsapp.com/', icon: 'whatsapp' },
  { label: 'Reddit', href: 'https://www.reddit.com/', icon: 'reddit' },
]

/** Playlists + social (Favorites card) */
export const favorites: Bookmark[] = [...playlists, ...favoritesSocial]

export const favoriteGroups: { label?: string; items: Bookmark[] }[] = [
  { label: 'Playlists', items: playlists },
  { items: favoritesSocial },
]

/** Watch */
export const entertainment: Bookmark[] = [
  { label: 'Netflix', href: 'https://www.netflix.com/browse', icon: 'netflix' },
  { label: 'KissKH', href: 'https://kisskh.is/', icon: 'kisskh' },
  {
    label: 'Prime Video',
    href: 'https://www.primevideo.com/storefront?ref_=atv_hm_hom_c_9zZ8D2_hom',
    icon: 'prime',
  },
  { label: 'Hotstar', href: 'https://www.hotstar.com/in/home', icon: 'hotstar' },
  { label: 'Sun NXT', href: 'https://www.sunnxt.com/', icon: 'sunnxt' },
  { label: 'Apple TV', href: 'https://tv.apple.com/in', icon: 'appletv' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
]

/** Dev, career, shopping */
export const work: Bookmark[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  {
    label: 'Notion',
    href: 'https://app.notion.com/p/balakrishnan2k/none-390a9234892f80e4a1c1f268549432c7',
    icon: 'notion',
  },
  { label: 'Naukri', href: 'https://www.naukri.com/mnjuser/homepage', icon: 'naukri' },
  { label: 'Amazon', href: 'https://www.amazon.in/ref=nav_logo', icon: 'amazon' },
  { label: 'Flipkart', href: 'https://www.flipkart.com/', icon: 'flipkart' },
  {
    label: 'The Pirate Bay',
    href: 'https://unblocked.knaben.info/thepiratebay/?__goaway_challenge=resource-load&__goaway_id=fa16e6ede8706d1c213013d6dd87238d',
    icon: 'piratebay',
  },
]
