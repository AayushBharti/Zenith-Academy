interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  image: string
  accountType: string
  additionalDetails: {
    gender: string
    dateOfBirth: string
    about: string
    contactNumber: string
  }
  createdAt: string
  updatedAt: string
  active: string
  approved: string
}
