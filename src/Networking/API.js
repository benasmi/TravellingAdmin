import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);
const insertPlace = (data) => RequestType.postRequest("api/v1/place/insert",data);
const updatePlace = (data) => RequestType.postRequest("api/v1/place/update", data);
const getPlaceById = (urlParams) => RequestType.getRequest("api/v1/place/getplace", urlParams);
const Places = {getAllPlaces, insertPlace, updatePlace, getPlaceById};

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);
const Tags = {getAllTags, addTag};

//Category
const addCategory = (params) => RequestType.postRequest("api/v1/categories/insert", params);
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");
const Categories = {addCategory, getAllCategories};

//Photo
const addPhoto = (params) => RequestType.postRequest("api/v1/photo/insert", params);
const uploadPhoto = (params) => RequestType.postMultipartRequest("api/v1/photo/upload", params);
const Photos = {addPhoto, uploadPhoto};


//Parking
const getParkingByLocation = (urlParams) =>RequestType.getRequest("api/v1/parking/search", urlParams);
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



const API = {Places, Tags, Categories, Photos, Parking, TagsPlace, CategoriesPlace, ParkingPlace, PhotoPlace};

export default API

