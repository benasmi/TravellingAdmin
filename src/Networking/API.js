import RequestType from '../Networking/NetworkLayerCentral'

//Users
const getAllPlaces = (urlParams) => RequestType.getRequest("api/v1/place/all", urlParams);

const API = {getAllPlaces};

export default API

