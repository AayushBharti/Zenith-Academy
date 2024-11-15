"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
// import { useRouter } from "next/navigation"
import { getCatalogaPageData } from "@/services/catalogService"
import { apiConnector } from "@/utils/apiConnector"
import { categories } from "@/utils/apis"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCard } from "@/components/Catalog/CourseCard"
import { CourseSlider } from "@/components/Catalog/CourseSlider"

interface Category {
  _id: string
  name: string
  description: string
}

interface Course {
  _id: string
  courseName: string
  thumbnail: string
  instructor: {
    firstName: string
    lastName: string
  }
  price: number
  ratingAndReviews: any[]
}

export default function CatalogPage() {
  const params = useParams()
  const catalogName = params.catalogName

  const [category, setcategory] = useState<Category | null>(null)
  const [catalogPageData, setCatalogPageData] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<string>("popular")

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API)
        // Find the category item that matches the catalog name
        const category = result.data.data.find(
          (item: any) => item.name.toLowerCase() === catalogName
        )
        if (!category) {
          console.error("Category not found")
          return notFound()
        }
        setcategory(category)
        console.log("category", category)
      } catch (error) {
        console.error("Could not fetch categories:", error)
      }
    }
    fetchSublinks()
  }, [params])

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      if (category) {
        try {
          const result = await getCatalogaPageData(category._id)
          setCatalogPageData(result)
        } catch (error) {
          console.error("Could not fetch catalog page data:", error)
        }
      }
    }

    fetchCatalogPageData()
  }, [category?._id])

  if (!category || !catalogPageData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }
  console.log(category)
  console.log(catalogPageData)
  return (
    <div>
      <div className="bg-primary-foreground px-4 py-8">
        <div className="mx-auto max-w-maxContent flex flex-col justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            Home / Catalog / <span className="text-primary">{catalogName}</span>
          </p>
          <h1 className="text-3xl font-bold text-primary">{catalogName}</h1>
          <p className="max-w-[870px] text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Courses to get you started</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="popular">
            <CourseSlider courses={catalogPageData.selectedCourses} />
          </TabsContent>
          <TabsContent value="new">
            <CourseSlider courses={catalogPageData.differentCourses} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Similar to {catalogName}</h2>
        <CourseSlider courses={catalogPageData.differentCourses} />
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalogPageData?.mostSellingCourses?.map((course: Course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
