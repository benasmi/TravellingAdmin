import React from "react";
import axios from "axios"

const request = async function(options) {
    const client = axios.create({
        baseURL: "http://localhost:8080/",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });

    const onSuccess = function (response) {
        console.debug('Request Successful!', response);
        return response.data;
    };

    const onError = function (error) {
        console.debug('Request Failed:', error.config);
        if (error.response) {
            console.debug('Status:', error.response.status);
            console.debug('Data:', error.response.data);
            console.debug('Headers:', error.response.headers);
        } else {
            console.debug('Error Message:', error.message);
        }
        return Promise.reject(error.response || error.message);
    };

    return client(options)
        .then(onSuccess)
        .catch(onError);
};

const getRequest = function (path, urlData= "") {
    return request({
        url:path+urlData,
        method: 'GET'
    });
};

const postRequest = function (path, data) {
    return request({
        url:    path,
        method: 'POST',
        data: data
    });
};

const RequestType = {
    getRequest, postRequest
};

export default RequestType


