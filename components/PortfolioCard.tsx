import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface PortfolioCardProps {
  title: string
  description: string
  url: string
  cover?: string
  slug: string
  index?: number
}

export default function PortfolioCard({ title, description, url, cover, slug, index = 0 }: PortfolioCardProps) {
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  // Gradient colors for visual variety (fallback when no cover image)
  const gradientColors = [
    'from-purple-500/10 to-blue-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-cyan-500/10 to-teal-500/10',
    'from-teal-500/10 to-green-500/10',
    'from-green-500/10 to-yellow-500/10',
    'from-yellow-500/10 to-orange-500/10',
  ]
  const gradientColor = gradientColors[index % gradientColors.length]

  // Image path for cover
  const coverImagePath = cover ? `/portfolio/${slug}/${cover}` : null

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      data-testid={`card-portfolio-${index}`}
      style={{
        animation: `fadeIn 0.4s ease-out ${index * 50}ms both`,
      }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm group-hover:-translate-y-1">
        <div className={`relative aspect-[16/10] overflow-hidden border-b border-border/50 ${!coverImagePath ? `bg-gradient-to-br ${gradientColor}` : ''}`}>
          {coverImagePath ? (
            <>
              <Image
                src={coverImagePath}
                alt={`${title} - ${description}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                unoptimized
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-sm">
                    <ExternalLink className="w-8 h-8 text-white/80" />
                  </div>
                  <p className="text-sm text-white/90 font-medium tracking-wide">
                    {getDomainFromUrl(url)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-200 font-display" data-testid={`text-title-${index}`}>
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed" data-testid={`text-description-${index}`}>
                {description}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ExternalLink className="w-4 h-4 text-primary" data-testid={`icon-external-${index}`} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
