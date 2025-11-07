import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-heading text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Page not found
      </p>
      <Button asChild>
        <Link href="/">
          Go Home
        </Link>
      </Button>
    </div>
  )
}
