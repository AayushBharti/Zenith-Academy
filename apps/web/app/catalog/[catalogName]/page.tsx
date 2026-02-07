"use client";

import { AlertCircle, Home, SearchX } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import { CourseSlider } from "@/components/common/course-slider";
import ReviewsCarousel from "@/components/common/review-carousel";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Services & Utils
import { getCatalogaPageData } from "@/services/catalog-service";
import type { Category, CourseDetails } from "@/types/course";
import { apiConnector } from "@/utils/api-connector";
import { categories } from "@/utils/apis";

export default function CatalogPageContent() {
  // 1. Get the slug from the URL
  const { catalogName } = useParams();
  const catalogSlug = catalogName as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [catalogPageData, setCatalogPageData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 2. Fetch all categories
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("result", result.data.data);

        // 3. Find the category by matching the SLUG
        const foundCategory = result.data.data.find(
          (item: any) => item.slug === catalogSlug
        );

        if (!foundCategory) {
          setError("Category not found");
          setIsLoading(false);
          return;
        }
        setCategory(foundCategory);

        // 4. Fetch page details using the Category ID
        const pageData = await getCatalogaPageData(foundCategory._id);
        setCatalogPageData(pageData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load catalog data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (catalogSlug) {
      fetchData();
    }
  }, [catalogSlug]);

  if (isLoading) return <CatalogSkeleton />;

  if (error || !category)
    return <ErrorState message={error || "Category not found"} />;

  const hasNoCourses = !(
    catalogPageData?.selectedCourses?.length ||
    catalogPageData?.differentCourses?.length ||
    catalogPageData?.mostSellingCourses?.length
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <CatalogHeader category={category} />

      <main className="container mx-auto space-y-20 px-4 py-12 md:px-6 lg:px-8">
        {hasNoCourses ? (
          <NoCourses categoryName={category.name} />
        ) : (
          <div className="fade-in-50 animate-in space-y-20 duration-500">
            {/* 1. Hero / Selected Courses */}
            <section className="space-y-8">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
                  Courses to get you started
                </h2>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Hand-picked courses to jumpstart your learning path in{" "}
                  <span className="font-medium text-primary">
                    {category.name}
                  </span>
                  .
                </p>
              </div>

              <Tabs
                className="w-full"
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <TabsList className="mb-8 grid w-full grid-cols-2 sm:w-[400px]">
                  <TabsTrigger value="popular">Most Popular</TabsTrigger>
                  <TabsTrigger value="new">New Arrivals</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="space-y-4 focus-visible:outline-none"
                  value="popular"
                >
                  <CourseSlider
                    courses={catalogPageData?.selectedCourses || []}
                  />
                </TabsContent>
                <TabsContent
                  className="space-y-4 focus-visible:outline-none"
                  value="new"
                >
                  <CourseSlider
                    courses={catalogPageData?.differentCourses || []}
                  />
                </TabsContent>
              </Tabs>
            </section>

            <Separator className="bg-border/50" />

            {/* 2. Top Selling */}
            <CourseSection
              badge="Top Selling"
              courses={catalogPageData?.mostSellingCourses || []}
              title="Frequently Bought Together"
            />

            <Separator className="bg-border/50" />

            {/* 3. Similar Courses */}
            <CourseSection
              courses={catalogPageData?.differentCourses || []}
              title={`More in ${category.name}`}
            />

            <Separator className="bg-border/50" />

            {/* 4. Social Proof (Reviews) */}
            <div className="pt-8">
              <ReviewsCarousel />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sub Components ---

function CatalogHeader({ category }: { category: Category }) {
  return (
    <div className="w-full border-b bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className="flex items-center gap-1 transition-colors hover:text-primary"
                    href="/"
                  >
                    <Home className="h-3.5 w-3.5" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/catalog"
                  >
                    Catalog
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-primary">
                  {category.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4">
            <h1 className="font-extrabold text-4xl text-foreground tracking-tight lg:text-6xl">
              {category.name}
            </h1>
            <p className="max-w-3xl text-muted-foreground text-xl leading-relaxed">
              {category.description ||
                `Explore our comprehensive collection of ${category.name} courses designed to help you master new skills.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseSection({
  title,
  courses,
  badge,
}: {
  title: string;
  courses: CourseDetails[];
  badge?: string;
}) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-3xl text-foreground tracking-tight">
          {title}
        </h2>
        {badge && (
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            {badge}
          </Badge>
        )}
      </div>
      <CourseSlider courses={courses} />
    </section>
  );
}

function NoCourses({ categoryName }: { categoryName: string }) {
  const router = useRouter();
  return (
    <div className="zoom-in-95 flex animate-in flex-col items-center justify-center py-32 text-center duration-500">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mb-3 font-bold text-3xl">No courses found</h2>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        We currently don't have any courses listed under{" "}
        <span className="font-semibold text-foreground">{categoryName}</span>.
        Check back later.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} size="lg" variant="outline">
          Go Home
        </Button>
        <Button onClick={() => router.push("/catalog")} size="lg">
          Explore Catalog
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="font-bold text-2xl">Something went wrong</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      <Button onClick={() => router.back()} variant="outline">
        Go Back
      </Button>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="w-full border-b bg-muted/30 pt-20 pb-12">
        <div className="container mx-auto space-y-6 px-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-16 w-3/4 max-w-xl" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto space-y-20 px-4 py-12">
        {[1, 2].map((section) => (
          <div className="space-y-8" key={section}>
            <div className="space-y-3">
              <Skeleton className="h-10 w-64" />
              {section === 1 && (
                <Skeleton className="h-12 w-[400px] rounded-lg" />
              )}
            </div>

            {/* Course Cards Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((card) => (
                <div className="flex flex-col space-y-4" key={card}>
                  <Skeleton className="h-[220px] w-full rounded-xl" />
                  <div className="space-y-2 px-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex items-center justify-between px-1 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
