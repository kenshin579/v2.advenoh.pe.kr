import { getPortfolioItems } from '@/lib/portfolio'
import { getQuotes } from '@/lib/quotes'
import ProjectCard from '@/components/ProjectCard'
import QuoteRotator from '@/components/QuoteRotator'
import { siteConfig } from '@/lib/site-config'

export default function HomePage() {
  const portfolioItems = getPortfolioItems()
  const quotes = getQuotes()

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <div className="container mx-auto px-6 pt-32 pb-20">
        <section className="mb-32">
          <div className="max-w-5xl">
            <h1 className="font-display text-6xl md:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              HI THERE<br />
              I'M <span className="text-white/50">FRANK OH</span><br />
              <span className="bg-gradient-to-r from-purple-500 to-red-500 bg-clip-text text-transparent">SOFTWARE</span><br />
              ENGINEER
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-16 border-t border-white/10 pt-8">
              <QuoteRotator quotes={quotes} intervalMs={20000} />
            </div>
          </div>
        </section>

        <section id="works" className="mb-20">
          <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl md:text-2xl font-mono text-white/40 uppercase tracking-widest">Recent Projects</h2>
            <span className="text-sm font-mono text-white/40">01 — {String(portfolioItems.length).padStart(2, '0')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <ProjectCard
                key={item.slug}
                title={item.title}
                description={item.description}
                url={item.site}
                cover={item.cover}
                slug={item.slug}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
