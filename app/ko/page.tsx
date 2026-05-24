import { loadHomeData } from '@/lib/home-data'
import { getProjectsItemListStructuredData } from '@/lib/structured-data'
import { ProfileShell } from '@/components/profile/ProfileShell'
import { ko } from '@/lib/i18n/ko'

export default async function KoHomePage() {
  const data = await loadHomeData('ko')
  const itemList = getProjectsItemListStructuredData(data.portfolioItems)

  return (
    <>
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
