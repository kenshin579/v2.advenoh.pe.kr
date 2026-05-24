import { loadHomeData } from '@/lib/home-data'
import { getProjectsItemListStructuredData, getPersonStructuredData, getWebSiteStructuredData } from '@/lib/structured-data'
import { ProfileShell } from '@/components/profile/ProfileShell'
import { ko } from '@/lib/i18n/ko'

export default async function KoHomePage() {
  const data = await loadHomeData('ko')
  const itemList = getProjectsItemListStructuredData(data.portfolioItems)
  const personData = getPersonStructuredData(ko.meta.description)
  const websiteData = getWebSiteStructuredData(ko.meta.description)

  return (
    <>
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
        locale="ko"
        t={ko}
        initialStatus={data.status}
        initialWriting={data.writing}
        portfolioItems={data.portfolioItems}
        github={data.github}
        readme={data.readme}
      />
    </>
  )
}
