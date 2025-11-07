import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface PortfolioCardProps {
  title: string
  description: string
  url: string
  index?: number
}

export default function PortfolioCard({ title, description, url, index = 0 }: PortfolioCardProps) {
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  // Gradient colors for visual variety
  const gradientColors = [
    'from-purple-500/10 to-blue-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-cyan-500/10 to-teal-500/10',
    'from-teal-500/10 to-green-500/10',
    'from-green-500/10 to-yellow-500/10',
    'from-yellow-500/10 to-orange-500/10',
  ]
  const gradientColor = gradientColors[index % gradientColors.length]

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
      <Card className="h-full transition-all duration-200 ease-out hover:shadow-lg cursor-pointer border border-card-border group-hover:scale-105">
        <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${gradientColor} rounded-t-lg`}>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {getDomainFromUrl(url)}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors duration-200" data-testid={`text-title-${index}`}>
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${index}`}>
                {description}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1" data-testid={`icon-external-${index}`} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
