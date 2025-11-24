import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const quoteSchema = z.object({
    quote: z.string(),
    author: z.string(),
})

export type Quote = z.infer<typeof quoteSchema>

export function getQuotes(): Quote[] {
    const quotesDirectory = path.join(process.cwd(), 'contents/quote')

    if (!fs.existsSync(quotesDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(quotesDirectory)
    const quotes: Quote[] = []

    for (const fileName of fileNames) {
        if (!fileName.endsWith('.md')) continue

        const fullPath = path.join(quotesDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        try {
            const quote = quoteSchema.parse(data)
            quotes.push(quote)
        } catch (error) {
            console.error(`Failed to parse quote from ${fileName}:`, error)
        }
    }

    return quotes
}
