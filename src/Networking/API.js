import RequestType from '../Networking/NetworkLayerCentral'

//Users
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/search", urlParams);
const getAllTags = () => RequestType.getRequest("api/v1/tags/all");

const API = {getAllPlaces, getAllTags};

export default API

