import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);
const addCategory = (params) => RequestType.postRequest("api/v1/categories/insert", params);
const addPhoto = (params) => RequestType.postRequest("api/v1/photo/insert", params);
const uploadPhoto = (params) => RequestType.postRequest("api/v1/photo/upload", params);
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");

const API = {getAllPlaces, getAllTags, getAllCategories, addTag, addCategory, addPhoto, uploadPhoto};

export default API

