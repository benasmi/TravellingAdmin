import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");

//Categories
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");


const API = {getAllPlaces, getAllTags, getAllCategories};

export default API

