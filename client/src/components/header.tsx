import { Moon, Sun } from "lucide-react";
import { SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  const socialLinks = [
    {
      name: "Instagram",
      icon: SiInstagram,
      url: "https://instagram.com",
      testId: "link-instagram",
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      url: "https://linkedin.com",
      testId: "link-linkedin",
    },
    {
      name: "GitHub",
      icon: SiGithub,
      url: "https://github.com",
      testId: "link-github",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-border transition-colors">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="font-display text-xl font-bold tracking-tight hover-elevate active-elevate-2 transition-all duration-200 px-2 py-1 rounded-md"
          data-testid="link-home"
        >
          Portfolio
        </a>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-elevate active-elevate-2 p-2 rounded-md transition-all duration-200"
              aria-label={social.name}
              data-testid={social.testId}
            >
              <social.icon className="w-5 h-5 text-foreground" data-testid={`icon-${social.name.toLowerCase()}`} />
            </a>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-md"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 transition-transform duration-200" data-testid="icon-moon" />
            ) : (
              <Sun className="w-5 h-5 transition-transform duration-200 rotate-180" data-testid="icon-sun" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
