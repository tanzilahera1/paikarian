// src/app/manifest.ts
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
   name: "Paikarian",
    short_name: 'Paikarian',
    description: '6 পিস দিয়েই পাইকারি রেটে ব্যবসা শুরু করুন',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a', // তোমার ব্র্যান্ড কালার দাও
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['shopping', 'electronics', 'technology'],
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    shortcuts: [
      {
        name: 'Smartphones',
        short_name: 'Phones',
        description: 'Browse latest smartphones',
        url: '/products/smartphones',
        icons: [{ src: '/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Track Order',
        short_name: 'Track',
        description: 'Track your order',
        url: '/track-order',
        icons: [{ src: '/logo.png', sizes: '96x96' }]
      }
    ]
  }
}