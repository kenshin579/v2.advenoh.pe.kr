import Link from 'next/link'
import { Instagram, Linkedin, Github } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: siteConfig.author.social.github,
      testId: 'footer-link-github',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: siteConfig.author.social.linkedin,
      testId: 'footer-link-linkedin',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: siteConfig.author.social.instagram,
      testId: 'footer-link-instagram',
    },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.author.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                data-testid={social.testId}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
