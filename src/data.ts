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
  | 'bbc'
  | 'imdb'
  | 'nyt'
  | 'wapo'
  | 'latimes'
  | 'techcrunch'
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

export type Story = {
  title: string
  age: string
}

export type ScheduleEvent = {
  title: string
  time: string
}

export const profile = {
  name: 'Won',
  address: '2094 Pierce Brennen Ct, Lawrenceville, GA 30043',
  addressDisplay: ['2094 PIERCE BRENNEN CT, LAWRENCEVILLE, GA', '30043'],
  latitude: 33.9562,
  longitude: -83.9879,
}

export const calendarNote = 'Rest up — tomorrow is a new day.'

export const schedule: ScheduleEvent[] = [
  { title: 'Ping Madison about key pickup time', time: '10:30 AM' },
  { title: 'Walk dog at dogpark', time: '3:30 PM' },
  { title: 'AIGA Poster Show', time: '6:15 PM' },
]

export const quote = {
  text: 'The best and most beautiful things in the world cannot be seen or even touched – they must be felt with the heart.',
  author: 'Helen Keller',
  badge: 'Daily Wisdom',
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

export const newsLinks: Bookmark[] = [
  { label: 'BBC', href: 'https://www.bbc.com/news', icon: 'bbc' },
  { label: 'IMDb', href: 'https://www.imdb.com', icon: 'imdb' },
  { label: 'New York Times', href: 'https://www.nytimes.com', icon: 'nyt' },
  { label: 'Washington Post', href: 'https://www.washingtonpost.com', icon: 'wapo' },
  { label: 'LA Times', href: 'https://www.latimes.com', icon: 'latimes' },
  { label: 'TechCrunch', href: 'https://techcrunch.com', icon: 'techcrunch' },
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

export const stories: Story[] = [
  {
    title: 'Reform receives second £36m donation in two days as crypto investor matches record',
    age: '4H',
  },
  {
    title: "Burnham and Badenoch review red versus blue politics as Reform land 'gobsmacking' donations",
    age: '4H',
  },
  {
    title: "Trump says united Ireland would be 'fantastic' during visit to Dublin",
    age: '3H',
  },
  {
    title: 'Anthropic boss Dario Amodei calls for AI development to slow down',
    age: '3H',
  },
  {
    title: 'Saudi Arabia shuts key oil pipeline after drone attack launched from Iraq',
    age: '2H',
  },
  {
    title: 'Oscar-winning film producer Jeremy Thomas dies aged 77',
    age: '2H',
  },
  {
    title: "I never got to experience my baby's scan, but blind parents like me can now feel them",
    age: '2H',
  },
  {
    title: 'Hardened activists are changing tactics and mobilising the anti-migrant vote',
    age: '1H',
  },
  {
    title: "Every museum in the world is stressing: 'Did the Louvre heist embolden thieves?'",
    age: '1H',
  },
]
