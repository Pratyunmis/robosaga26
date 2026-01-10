import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RoboSaga'26 - BIT Mesra's Premier Robotics Festival",
    short_name: "RoboSaga'26",
    description: "RoboSaga'26 - The Ultimate Robotics Festival at BIT Mesra featuring hackathon, workshops, exhibitions, and speaker sessions.",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#F8C437',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
