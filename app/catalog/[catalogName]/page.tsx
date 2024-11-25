"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { getCatalogaPageData } from "@/services/catalogService"
import { apiConnector } from "@/utils/apiConnector"
import { categories } from "@/utils/apis"
import { FileQuestion } from "lucide-react"

import { Category, CourseDetails } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseSlider } from "@/components/Common/CourseSlider"

export default function CatalogPageContent() {
  const { catalogName } = useParams()
  const decodedCatalogName = decodeURIComponent(catalogName as string)

  const [category, setCategory] = useState<Category | null>(null)
  const [catalogPageData, setCatalogPageData] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<string>("popular")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API)
        const foundCategory = result.data.data.find(
          (item: any) =>
            item.name.toLowerCase() === decodedCatalogName.toLowerCase()
        )
        if (!foundCategory) {
          return notFound()
        }
        setCategory(foundCategory)

        const pageData = await getCatalogaPageData(foundCategory._id)
        setCatalogPageData(pageData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load catalog data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [decodedCatalogName])

  if (isLoading) {
    return <CatalogSkeleton />
  }

  if (error || !category || !catalogPageData) {
    return notFound()
  }

  const hasNoCourses =
    !catalogPageData.selectedCourses?.length &&
    !catalogPageData.differentCourses?.length &&
    !catalogPageData.mostSellingCourses?.length

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader category={category} />
      <div className="mx-auto max-w-maxContent px-4 py-12 space-y-12">
        {hasNoCourses ? (
          <NoCourses categoryName={category.name} />
        ) : (
          <>
            <SelectedCategoryCourses
              title="Courses to get you started"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              popularCourses={catalogPageData.selectedCourses}
              newCourses={catalogPageData.differentCourses}
            />
            <MoreCoursesSection
              title={`Similar to ${category.name}`}
              courses={catalogPageData.differentCourses}
            />
            <MoreCoursesSection
              title={`Frequently Bought Together`}
              courses={catalogPageData.mostSellingCourses}
            />
          </>
        )}
      </div>
    </div>
  )
}

function CatalogHeader({ category }: { category: Category }) {
  return (
    <div className="bg-primary-foreground px-4 py-8">
      <div className="mx-auto max-w-maxContent flex flex-col justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          Home / Catalog / <span className="text-primary">{category.name}</span>
        </p>
        <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
        <p className="max-w-[870px] text-muted-foreground">
          {category.description}
        </p>
      </div>
    </div>
  )
}

function SelectedCategoryCourses({
  title,
  activeTab,
  setActiveTab,
  popularCourses,
  newCourses,
}: any) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        <TabsContent value="popular">
          <CourseSlider courses={popularCourses} />
        </TabsContent>
        <TabsContent value="new">
          <CourseSlider courses={newCourses} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

function MoreCoursesSection({
  title,
  courses,
}: {
  title: string
  courses: CourseDetails[]
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <CourseSlider courses={courses} />
    </section>
  )
}

function NoCourses({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't find any courses in the {categoryName} category at the
        moment.
      </p>
      <Button>Explore Other Categories</Button>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary-foreground px-4 py-8">
        <div className="mx-auto max-w-maxContent flex flex-col justify-center gap-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-20 w-full max-w-[870px]" />
        </div>
      </div>
      <div className="mx-auto max-w-maxContent px-4 py-12 space-y-12">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
