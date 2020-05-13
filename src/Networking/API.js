import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);
const Places = {getAllPlaces};

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);
const Tags = {getAllTags, addTag};

//Category
const addCategory = (params) => RequestType.postRequest("api/v1/categories/insert", params);
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");
const Categories = {addCategory, getAllCategories};

const addPhoto = (params) => RequestType.postRequest("api/v1/photo/insert", params);
const uploadPhoto = (params) => RequestType.postRequest("api/v1/photo/upload", params);
const Photos = {addPhoto, uploadPhoto};

//Parking
const getParkingByLocation = (urlParams) =>RequestType.getRequest("api/v1/parking/search", urlParams);
const insertNewParking = (data) =>  RequestType.postRequest("api/v1/parking/insert", data);
const Parking = {getParkingByLocation, insertNewParking};

const API = {Places, Tags, Categories, Photos, Parking};

export default API

