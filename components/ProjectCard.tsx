'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
    title: string
    description: string
    url: string
    cover?: string
    slug: string
    index: number
}

export default function ProjectCard({ title, description, url, cover, slug, index }: ProjectCardProps) {
    const coverImagePath = cover ? `/portfolio/${slug}/${cover}` : null
    const formattedIndex = String(index + 1).padStart(2, '0')

    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full aspect-[16/9] overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all duration-500"
        >
            {/* Background Gradient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-purple-900/20 via-purple-900/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full p-4 md:p-6 flex flex-col z-10">
                {/* Top Section: Image & Description */}
                <div className="flex justify-between items-start gap-4 mb-6">
                    {/* Circular Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/20 transition-colors duration-500 shrink-0">
                        {coverImagePath ? (
                            <Image
                                src={coverImagePath}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <ArrowUpRight className="w-8 h-8 text-white/20" />
                            </div>
                        )}
                    </div>

                    {/* Description Text */}
                    <div className="flex-1 max-w-xs text-right">
                        <p className="text-sm text-white/50 leading-relaxed line-clamp-6 group-hover:text-white/70 transition-colors duration-300">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Title & Index */}
                <div className="flex items-end justify-between">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors duration-300">
                        {title}
                    </h3>
                    <span className="font-mono text-2xl md:text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-300">
                        {formattedIndex}
                    </span>
                </div>
            </div>
        </Link>
    )
}
