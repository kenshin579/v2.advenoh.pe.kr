import { getPortfolioItems } from '@/lib/portfolio'
import PortfolioCard from '@/components/PortfolioCard'

export default function HomePage() {
  const portfolioItems = getPortfolioItems()

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4">
          Portfolio
        </h1>
        <p className="text-muted-foreground">
          A collection of web development projects
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <PortfolioCard
              key={item.slug}
              title={item.title}
              description={item.description}
              url={item.site}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
