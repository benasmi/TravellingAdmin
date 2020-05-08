import RequestType from '../Networking/NetworkLayerCentral'

//Users
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");
const addTag = (params) => RequestType.postRequest("api/v1/tags/insert", params);

const API = {getAllPlaces, getAllTags, addTag};

export default API

