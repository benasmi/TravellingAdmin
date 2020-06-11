import React from "react";
import axios from "axios"
import history from "../helpers/history";
import {getAccessToken} from "../helpers/tokens";
import Cookies from "js-cookie";
import app from "../helpers/firebaseInit";

const request = async function (options, contentType) {

    const client = axios.create({
        baseURL: false ? "http://localhost:8080/" : "https://www.traveldirection.ax.lt:8080/",
        headers: {
            'Content-Type': (contentType == null) ? 'application/json' : contentType,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Authorization": getAccessToken()
        },
    });


    // Add a response interceptor
    client.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const originalRequest = error.config;
        const status = error.response.status;
        if (!!app.auth().currentUser  &&
            (status === 401 || status === 403) &&
            originalRequest._retry === undefined
        ) {
            //console.log("Users token has expired!");
            return app.auth().currentUser.getIdToken(true).then(token => {
                //console.log("Retrieving new token and making the same request!");
                originalRequest._retry = true;
                originalRequest.headers.Authorization = token;
                Cookies.set("access_token", token);
                return axios(originalRequest)
            });
        }
        return Promise.reject(error);
    });

    const onSuccess = function (response) {
        console.log('Request Successful!', response);
        return response.data;
    };

    const onError = function (error) {
        console.debug('Request Failed:', error.config);
        if (error.response) {
            console.debug('Status:', error.response.status);
            if (error.response.status === 403) {
                history.push("/login")
            }
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

const getRequest = function (path, urlData = "") {
    return request({
        url: path + urlData,
        method: 'GET'
    });
};

const postRequest = function (path, data, urlData = "") {
    return request({
        url: path + urlData,
        method: 'POST',
        data: data
    });
};

const postMultipartRequest = function (path, formData) {
    return request({
        url: path,
        method: 'POST',
        data: formData
    }, 'multipart/form-data' /*'application/x-www-form-urlencoded'*/);
};

const RequestType = {
    getRequest, postRequest, postMultipartRequest
};

export default RequestType


