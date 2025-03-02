import { apiConnector } from "@/utils/api-connector"
import { catalogData } from "@/utils/apis"

export const getCatalogaPageData = async (categoryId: string | number) => {
  let result: any = []

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )

    console.log("CATALOG PAGE DATA API RESPONSE....", response)

    if (!response.data.success) {
      throw new Error("Could not Fetch Category page data error")
    }

    result = response.data
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error)
    result = (error as any)?.response?.data
  }

  return result
}
