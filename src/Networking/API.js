import RequestType from '../Networking/NetworkLayerCentral'

//Places
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);

//Tags
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");

//Categories
const getAllCategories = () => RequestType.getRequest("api/v1/categories/all");

//Parking
const getParkingByLocation = (urlParams) =>RequestType.getRequest("api/v1/parking/search", urlParams);
const insertNewParking = (data) =>  RequestType.postRequest("api/v1/parking/insert", data);

const API = {getAllPlaces, getAllTags, getAllCategories, getParkingByLocation, insertNewParking};

export default API

