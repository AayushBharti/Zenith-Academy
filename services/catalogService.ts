import { toast } from "react-hot-toast"

import { apiConnector } from "../utils/apiConnector"
import { catalogData } from "../utils/apis"

interface ErrorResponse {
  response?: {
    data: any // You can be more specific here based on the API error response structure
  }
}

export const getCatalogaPageData = async (categoryId: string | number) => {
  // (setProgress(50)

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
    // Check if it's an ErrorResponse structure
    if ((error as ErrorResponse).response?.data) {
      toast.error("No Course added to this category yet")
      result = (error as ErrorResponse).response?.data
    } else {
      toast.error("An unexpected error occurred in getCatalogaPageData")
    }
  }

  // toast.dismiss(toastId);
  // (setProgress(100)

  return result
}
