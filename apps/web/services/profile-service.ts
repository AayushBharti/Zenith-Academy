import { toast } from "sonner";

import { apiConnector } from "../utils/api-connector";
import { profileEndpoints, settingsEndpoints } from "../utils/apis";
import { logout } from "./auth-service";

//getEnrolledCourses
export async function getUserCourses(token: string) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    // console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES")
    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    // console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES")
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
}

//updateProfilePicture
export async function updatePfp(token: string, pfp: File) {
  const toastId = toast.loading("Uploading...");
  try {
    const formData = new FormData();
    console.log("pfp", pfp);
    formData.append("pfp", pfp);
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,
      formData,
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log(
      "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
      response
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Profile Picture Updated Successfully");
    const imageUrl = response.data.data.image;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user") as string),
        image: imageUrl,
      })
    );
    console.log(JSON.parse(localStorage.getItem("user") as string).image);
  } catch (error: any) {
    console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

type updatedData = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string | undefined;
  contactNumber?: string | undefined;
  about?: string | undefined;
};

//updateAdditionalDetails
export async function updateAdditionalDetails(
  token: string,
  additionalDetails: updatedData
) {
  console.log("additionalDetails", additionalDetails);
  const { firstName, lastName, dateOfBirth, gender, contactNumber, about } =
    additionalDetails;
  console.log("additionalDetails", additionalDetails);
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.UPDATE_PROFILE_API,
      { firstName, lastName, dateOfBirth, gender, contactNumber, about },
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log(
      "UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............",
      response
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Additional Details Updated Successfully");
    const user = JSON.parse(localStorage.getItem("user") as string);
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.additionalDetails.dateOfBirth =
      dateOfBirth || user.additionalDetails.dateOfBirth;
    user.additionalDetails.contactNumber =
      contactNumber || user.additionalDetails.contactNumber;
    user.additionalDetails.about = about || user.additionalDetails.about;
    user.additionalDetails.gender = gender;
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error: any) {
    console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error);
    toast.error(error.response.data.message);
  } finally {
    toast.dismiss(toastId);
  }
}

type Password = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

//updatePassword
export async function updatePassword(token: string, password: Password) {
  const {
    currentPassword: oldPassword,
    newPassword,
    confirmPassword: confirmNewPassword,
  } = password;
  // console.log("password", password)
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "POST",
      settingsEndpoints.CHANGE_PASSWORD_API,
      { oldPassword, newPassword, confirmNewPassword },
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log("UPDATE_PASSWORD_API API RESPONSE............", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Updated Successfully");
  } catch (error: any) {
    console.log("UPDATE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

//deleteAccount
export async function deleteAccount(
  token: string,
  navigate: (path: string) => void
) {
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector(
      "DELETE",
      settingsEndpoints.DELETE_PROFILE_API,
      null,
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log("DELETE_ACCOUNT_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Account Deleted Successfully");

    logout(navigate);
  } catch (error: any) {
    console.log("DELETE_ACCOUNT_API API ERROR............", error);
    toast.error(
      error.response?.data?.message ||
        "An error occurred while deleting the account."
    );
  } finally {
    toast.dismiss(toastId);
  }
}

//get instructor dashboard
export async function getInstructorDashboard(token: string) {
  // const toastId = toast.loading("Loading...");
  let result = [];
  try {
    console.log("BEFORE Calling BACKEND API FOR INSTRUCTOR DASHBOARD");
    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API,
      null,
      {
        Authorisation: `Bearer ${token}`,
      }
    );
    console.log("AFTER Calling BACKEND API FOR INSTRUCTOR DASHBOARD");
    // console.log(
    //   "GET_INSTRUCTOR_DASHBOARD_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_INSTRUCTOR_DASHBOARD_API API ERROR............", error);
    toast.error("Could Not Get Instructor Dashboard");
  }
  // toast.dismiss(toastId)
  return result;
}
