'use client'

import Link from 'next/link'
import { Moon, Sun, Instagram, Linkedin, Github } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'

export default function Header() {
  const { theme, setTheme } = useTheme()

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: siteConfig.author.social.github,
      testId: 'link-github',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: siteConfig.author.social.linkedin,
      testId: 'link-linkedin',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: siteConfig.author.social.instagram,
      testId: 'link-instagram',
    },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-border transition-colors">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight hover-elevate active-elevate-2 transition-all duration-200 px-2 py-1 rounded-md"
          data-testid="link-home"
        >
          {siteConfig.author.name}
        </Link>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-elevate active-elevate-2 p-2 rounded-md transition-all duration-200"
              aria-label={social.name}
              data-testid={social.testId}
            >
              <social.icon className="w-5 h-5 text-foreground" />
            </Link>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-md"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}
