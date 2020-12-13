import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);
const getAllPlacesAdmin = (urlParams) => RequestType.getRequest("api/v1/place/searchadmin", urlParams);
const getClosesPlacesAdmin = (urlParams) => RequestType.getRequest("api/v1/place/searchadmin/closest", urlParams);

const insertPlace = (data) => RequestType.postRequest("api/v1/place/insert",data);
const updatePlace = (data) => RequestType.postRequest("api/v1/place/update", data);
const getPlaceById = (urlParams) => RequestType.getRequest("api/v1/place/getplace", urlParams);
const searchApiPlaces = (urlParams) => RequestType.getRequest("api/v1/placeApi/search", urlParams);
const removePlace = (urlParams) => RequestType.getRequest("api/v1/place/delete", urlParams);

const getAllCities = (urlParams) =>RequestType.getRequest("api/v1/place/city/all",urlParams);
const getAllCounties = (urlParams) =>RequestType.getRequest("api/v1/place/county/all",urlParams);
const getAllCountries = (urlParams) =>RequestType.getRequest("api/v1/place/country/all",urlParams);
const getAllMunicipalities = (urlParams) =>RequestType.getRequest("api/v1/place/municipality/all",urlParams);

const Places = {getClosesPlacesAdmin,getAllCities,getAllCounties, getAllCountries, getAllMunicipalities, getAllPlaces, insertPlace, updatePlace, getPlaceById,getAllPlacesAdmin,searchApiPlaces, removePlace};

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);
const removeTags = (params) => RequestType.postRequest("api/v1/tags/delete", params);
const updateTags = (params) => RequestType.postRequest("api/v1/tags/update", params);
const updateFeaturedTags = (data) => RequestType.postRequest("api/v1/tags/featured/update", data);
const Tags = {getAllTags, addTag, removeTags, updateTags, updateFeaturedTags};

//Category
const addCategory = (params) => RequestType.postRequest("api/v1/categories/insert", params);
const removeCategory = (params) => RequestType.postRequest("api/v1/categories/delete", params);
const updateCategory = (params) => RequestType.postRequest("api/v1/categories/update", params);
const getAllCategories = (params) => RequestType.getRequest("api/v1/categories/all", params);
const getAllAbstractedCategories = (params) => RequestType.getRequest("api/v1/categories/all/abstracted", params);
const updateAbstractedCategories = (data) => RequestType.postRequest("api/v1/categories/update/abstracted", data);
const abstractedCategoriesLeftOver = () => RequestType.getRequest("api/v1/categories/abstracted/left");
const Categories = {addCategory, getAllCategories, removeCategory, updateCategory, getAllAbstractedCategories, updateAbstractedCategories, abstractedCategoriesLeftOver};

//Photo
const addPhoto = (params) => RequestType.postRequest("api/v1/photo/insert", params);
const uploadPhoto = (params) => RequestType.postMultipartRequest("api/v1/photo/upload", params);
const Photos = {addPhoto, uploadPhoto};


//Parking
const getParkingByLocation = (urlParams) =>RequestType.getRequest("api/v1/parking/searchAdmin", urlParams);
const insertNewParking = (data) =>  RequestType.postRequest("api/v1/parking/insert", data);
const Parking = {getParkingByLocation, insertNewParking};


//TagsPlace
const updateTagsForPlace = (data, urlParams) => RequestType.postRequest("api/v1/tagsplace/update", data, urlParams);
const TagsPlace = {updateTagsForPlace};

//CategoriesPlace
const updateCategoriesForPlace = (data, urlParams) => RequestType.postRequest("api/v1/categoryplace/update", data, urlParams);
const CategoriesPlace = {updateCategoriesForPlace};

//PhotoPlace
const updateParkingForPlace = (data, urlParams) => RequestType.postRequest("api/v1/parkingplace/update", data, urlParams);
const ParkingPlace = {updateParkingForPlace};

//PhotoPlace
const updatePhotoForPlace = (data, urlParams) => RequestType.postRequest("api/v1/photoplace/update", data, urlParams);
const PhotoPlace = {updatePhotoForPlace};

//Schedule
const updateScheduleForPlace = (data, urlParams) => RequestType.postRequest("api/v1/ws/update", data, urlParams);
const Schedule = {updateScheduleForPlace};

//ReviewsPlace
const getPlaceReviews = (urlParams) => RequestType.getRequest("api/v1/reviews/all", urlParams);
const Reviews = {getPlaceReviews};

//Sources
const getSources = () => RequestType.getRequest("api/v1/source/all");
const addSource = (data) => RequestType.postRequest("api/v1/source/insert",data);
const Source = {getSources, addSource};

//SourcePlace
const updateSourcesForPlace = (data, urlParams) => RequestType.postRequest("api/v1/sourceplace/update", data, urlParams);
const SourcePlace = {updateSourcesForPlace};

//Tours
const insertTour = (data) => RequestType.postRequest("api/v1/tour/insert",data)
const updateTour = (data, urlParams) => RequestType.postRequest("api/v1/tour/update",data, urlParams)
const updateTourCategories = (data, urlParams) => RequestType.postRequest("api/v1/tour/categories/update",data, urlParams)
const getTour = (urlParams) => RequestType.getRequest("api/v1/tour",urlParams)
const getTourCategories = (urlParams) => RequestType.getRequest("api/v1/tour/categories",urlParams)
const removeTour = (urlParams) => RequestType.getRequest("api/v1/tour/delete", urlParams);
const getAllToursAdmin = (urlParams) => RequestType.getRequest("api/v1/tour/searchadmin", urlParams);
const Tour = {insertTour, getTour, updateTour, getAllToursAdmin, removeTour, getTourCategories, updateTourCategories}

//Auth
const login = (data) => RequestType.postRequest("api/v1/auth/login", data, "", false);
const register = (data) => RequestType.postRequest("api/v1/auth/registration",data, "", false);
const refreshToken = (data) => RequestType.postRequest("api/v1/auth/refresh", data, "", false);

const Auth = {register, login, refreshToken};

//User
const getUserProfile = () => RequestType.getRequest("api/v1/user/info");
const getAllUsers = (urlParams) => RequestType.getRequest("api/v1/user/search", urlParams);
const getAllRoles = () => RequestType.getRequest("api/v1/user/roles/all");
const setRoles = (data) => RequestType.postRequest("api/v1/user/setRoles", data);
const remove = (data) => RequestType.postRequest("api/v1/user/remove", data);
const changePassword = (data) => RequestType.postRequest("api/v1/user/changePassword", data);

const User = {setRoles, getAllRoles, getAllUsers, getUserProfile, remove, changePassword};

//Recommendation
const createRecommendation = (data) => RequestType.postRequest("api/v1/recommendation/create", data);
const getAllRecommendations = (urlParams) => RequestType.getRequest("api/v1/recommendation/search", urlParams);
const addPlaceToRecommendation = (data) => RequestType.postRequest("api/v1/recommendation/addObject", data);
const removePlaceFromRecommendation = (data) => RequestType.postRequest("api/v1/recommendation/removeObject", data);
const updateRecommendation = (data) => RequestType.postRequest("api/v1/recommendation/update", data)
const removeRecommendation = (data) => RequestType.postRequest("api/v1/recommendation/remove", data)

const Recommendation = { removeRecommendation, updateRecommendation, removePlaceFromRecommendation, addObjectToRecommendation: addPlaceToRecommendation, getAllRecommendations, createRecommendation }

//Explore

const updateExplorePage = (data) => RequestType.postRequest("api/v1/explore/update", data)
const getExplorePage = () => RequestType.getRequest("api/v1/explore/")

const Explore = { getExplorePage, updateExplorePage }

const API = {Explore, Recommendation, User, Auth, Tour, SourcePlace, Source,Places, Tags, Categories, Photos, Parking, TagsPlace, CategoriesPlace, ParkingPlace, PhotoPlace, Schedule, Reviews};

export default API

