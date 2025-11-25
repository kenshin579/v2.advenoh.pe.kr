'use client'

import Link from 'next/link'
import { Instagram, Linkedin, Github } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export default function Header() {
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

  return (
    <header className="fixed top-0 z-50 w-full mix-blend-difference">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-white hover:opacity-70 transition-opacity"
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
              <social.icon className="w-5 h-5 text-white hover:text-white/70 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
