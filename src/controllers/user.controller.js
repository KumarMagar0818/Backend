import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) =>
{
   //get user details from front end

   //get user fullName,email,password,

   //validation - not empty

   //check if user already exists:username email

   //check for images, check for avatar

   //upload them to cloudnary, avatar

   //create user object- create entry in db

   //remove password and refresh token field from response

   //check for user creation 

   //return res

   const { fullName, email, username, password } = req.body

   console.log("email:", email);
   if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "all fields are required")
   }

   const existedUser = User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(400, "User with email or username already exists")
   }

   const avtarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avtarLocalPath) {
      throw new ApiError(400, "Avtar file is required")
   }

   const avtar = await uploadOnCloudinary(avtarLocalPath)

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avtar) {
      throw new ApiError(400, "Avtar file is required")
   }

   const user = await User.create({
      fullName,
      avtar: avtar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if (!createUser) {
      throw new ApiError(500, "Something want wrong while registering the user")
   }

   return res.status(201).json(
      new ApiResponse(200, createUser, "user registered successfully!")
   )

})

export { registerUser }