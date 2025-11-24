'use client'

import { useState, useEffect } from 'react'
import type { Quote } from '@/lib/quotes'

interface QuoteRotatorProps {
    quotes: Quote[]
    intervalMs?: number
}

export default function QuoteRotator({ quotes, intervalMs = 5000 }: QuoteRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (quotes.length <= 1) return

        const interval = setInterval(() => {
            setIsAnimating(true)

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quotes.length)
                setIsAnimating(false)
            }, 300) // Half of the animation duration
        }, intervalMs)

        return () => clearInterval(interval)
    }, [quotes.length, intervalMs])

    if (quotes.length === 0) {
        return null
    }

    const currentQuote = quotes[currentIndex]

    return (
        <div className="relative overflow-hidden">
            <div
                className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
            >
                <p className="text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed">
                    "{currentQuote.quote}"
                    <br />
                    <span className="text-base text-white/40 mt-2 block">— {currentQuote.author}</span>
                </p>
            </div>
        </div>
    )
}
