import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const contentsDir = path.join(projectRoot, 'contents/website')
const publicDir = path.join(projectRoot, 'public/portfolio')

// Create public/portfolio directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Read all subdirectories in contents/website
const folders = fs.readdirSync(contentsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())

// Copy images from each subdirectory
folders.forEach(folder => {
  const sourceDir = path.join(contentsDir, folder.name)
  const targetDir = path.join(publicDir, folder.name)

  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Find and copy image files
  const files = fs.readdirSync(sourceDir)
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)
  })

  imageFiles.forEach(imageFile => {
    const sourcePath = path.join(sourceDir, imageFile)
    const targetPath = path.join(targetDir, imageFile)
    fs.copyFileSync(sourcePath, targetPath)
    console.log(`✓ Copied: ${folder.name}/${imageFile}`)
  })
})

console.log('✓ Portfolio images copied successfully')
