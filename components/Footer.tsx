import { siteConfig } from '@/lib/site-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            {siteConfig.author.name}
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Building digital experiences with passion and precision.
          </p>
          <div className="text-xs text-muted-foreground/60 mt-4">
            © {currentYear} {siteConfig.author.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
