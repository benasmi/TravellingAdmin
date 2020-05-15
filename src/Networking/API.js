import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);


//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);
const addCategory = (params) => RequestType.postRequest("api/v1/categories/insert", params);
const addPhoto = (params) => RequestType.postRequest("api/v1/photo/insert", params);
const uploadPhoto = (params) => RequestType.postMultipartRequest("api/v1/photo/upload", params);
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");

//Parking
const getParkingByLocation = (urlParams) =>RequestType.getRequest("api/v1/parking/search", urlParams);
const insertNewParking = (data) =>  RequestType.postRequest("api/v1/parking/insert", data);

const API = {getAllPlaces, getAllTags, getAllCategories, addTag, addCategory, addPhoto, uploadPhoto, getParkingByLocation, insertNewParking};

export default API

