import { useQuery } from "@tanstack/react-query";
import { PortfolioCard } from "@/components/portfolio-card";
import { Card } from "@/components/ui/card";
import type { PortfolioItem } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: items, isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground" data-testid="text-hero-title">
            Portfolio
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-2" data-testid="text-hero-tagline">
            크리에이티브 개발자
          </p>
          <p className="text-sm md:text-base text-muted-foreground" data-testid="text-hero-description">
            웹과 디자인의 경계를 탐구하며 사용자 경험을 혁신합니다.
            <br />
            각 프로젝트는 기술과 창의성의 조화를 담고 있습니다.
          </p>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" data-testid="loader-portfolio" />
                <p className="text-sm text-muted-foreground" data-testid="text-loading">프로젝트 로딩 중...</p>
              </div>
            </div>
          )}

          {error && (
            <Card className="p-8 text-center">
              <p className="text-destructive font-medium mb-2" data-testid="text-error">
                프로젝트를 불러올 수 없습니다
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-error-helper">
                나중에 다시 시도해 주세요
              </p>
            </Card>
          )}

          {!isLoading && !error && items && items.length === 0 && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2 text-card-foreground" data-testid="text-empty-title">
                  프로젝트가 없습니다
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-empty-helper">
                  contents/website 폴더에 마크다운 파일을 추가하여 프로젝트를 표시하세요
                </p>
              </div>
            </Card>
          )}

          {!isLoading && !error && items && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {items.map((item, index) => (
                <PortfolioCard key={item.fileName} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
