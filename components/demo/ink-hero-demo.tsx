'use client'

import InkHero from '@/components/ui/ink-hero'

export default function Demo() {
  return (
    <div className="bg-background text-foreground">
      <InkHero
        image={{
          src: 'https://cdn.21st.dev/assets/mirror/23/2332ac9678fe3160446b6a651905f646e7b121dc6f9e54cc5a27d93aff8b4c7a.jpg',
          alt: 'Ink landscape attributed to Sesshū Tōyō: mountains and a river in splashed ink on paper',
        }}
        eyebrow="Sumi-e · a scroll score in three stations"
        headline={'Ink on paper,\ndeveloped by scroll.'}
        caption="Sesshū Tōyō (attr.), Landscape, 15th c. · Honolulu Museum of Art · public domain"
        cta={{ label: 'Read the score', href: '#score' }}
        nav={{ brand: 'ease-atlas', links: [{ label: 'Score', href: '#score' }] }}
        inkColor="#1b1613"
      />
      <section id="score" className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-6 py-24">
        <h2 className="font-serif text-3xl">The score, in three stations.</h2>
      </section>
    </div>
  )
}
