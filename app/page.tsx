import { loadHomeData } from '@/lib/home-data'
import { getProjectsItemListStructuredData, getPersonStructuredData, getWebSiteStructuredData } from '@/lib/structured-data'
import { ProfileShell } from '@/components/profile/ProfileShell'
import { AutoLangRedirect } from '@/components/profile/AutoLangRedirect'
import { en } from '@/lib/i18n/en'

export default async function HomePage() {
  const data = await loadHomeData('en')
  const itemList = getProjectsItemListStructuredData(data.portfolioItems)
  const personData = getPersonStructuredData(en.meta.description)
  const websiteData = getWebSiteStructuredData(en.meta.description)

  return (
    <>
      <AutoLangRedirect />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <ProfileShell
        locale="en"
        t={en}
        initialStatus={data.status}
        initialWriting={data.writing}
        portfolioItems={data.portfolioItems}
        github={data.github}
        readme={data.readme}
      />
    </>
  )
}
