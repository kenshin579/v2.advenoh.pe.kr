'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { PortfolioItem } from '@/lib/portfolio'

interface PortfolioListProps {
    items: PortfolioItem[]
}

export default function PortfolioList({ items }: PortfolioListProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="relative w-full" ref={listRef}>
            <div className="flex flex-col">
                {items.map((item, index) => (
                    <Link
                        key={item.slug}
                        href={item.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative border-b border-white/10 py-8 md:py-12 transition-colors hover:bg-white/5"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="container mx-auto px-6 flex items-center justify-between">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                                <h3 className="font-display text-3xl md:text-5xl font-bold text-white/50 group-hover:text-white transition-colors duration-300 uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm md:text-base text-white/40 group-hover:text-white/70 transition-colors duration-300 font-mono">
                                    {item.description}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                                <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Floating Image Cursor */}
            <div
                className="pointer-events-none fixed z-50 w-[300px] h-[200px] rounded-lg overflow-hidden opacity-0 transition-opacity duration-300 ease-out hidden md:block"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                    opacity: hoveredIndex !== null ? 1 : 0,
                }}
            >
                {items.map((item, index) => {
                    const coverImagePath = item.cover ? `/portfolio/${item.slug}/${item.cover}` : null

                    if (!coverImagePath) return null

                    return (
                        <div
                            key={item.slug}
                            className="absolute inset-0 transition-opacity duration-300"
                            style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        >
                            <Image
                                src={coverImagePath}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
