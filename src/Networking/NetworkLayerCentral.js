import React from "react";
import axios from "axios"
import history from "../helpers/history";
import {getAccessToken, getRefreshToken} from "../helpers/tokens";
import API from "./API";

const request = async function (options, contentType, authorize= true) {

    const header = {
        'Content-Type': (contentType == null) ? 'application/json' : contentType,
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': "Bearer " + getAccessToken(),
        'device': 'web'
    };

    if(!authorize){
        delete header['Authorization']
    }

    const client = axios.create({
        baseURL: true ? "http://192.168.0.102:8080/" : "https://www.traveldirection.ax.lt:8080/",
        headers: header
    });



    // Add a response interceptor
    client.interceptors.response.use(function (response) {
        return response;
    },  function (error) {

        // console.log("Interceptor error", error);
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const originalRequest = error.config;
        const url = originalRequest.url;
        const status = error.response.status;


        if (error.response.status === 408 || error.code === 'ECONNABORTED' || error.code === "ERR_INTERNET_DISCONNECTED") {
            console.log(`A timeout happend on url ${error.config.url}`)
            return Promise.reject(error)
        }

        // Logout user if token refresh didn't work or user is disabled
        if (url === 'api/v1/auth/refresh') {
            console.log("Asking for refresh token");
            console.log("Unable to issue new JWT token. Redirecting to login page!");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            history.push("/login");
            return Promise.reject(error);
        }else if(url.startsWith("api/v1/auth")){
            return Promise.reject(error);
        }

        //Do not request for new JWT if response code is not Authorized
        if (status !== 403) {
            return Promise.reject(error);
        }

        if (status === 403 && originalRequest._retry === undefined) {
            console.log("Users token has expired!");

            originalRequest._retry = true;

            return API.Auth.refreshToken(getRefreshToken()).then(response=>{
                    console.log("Retrieving new token and making the same request!");
                    let token = response.access_token;
                    originalRequest.headers.Authorization = "Bearer " + token;
                    localStorage.setItem("access_token", token);
                    return axios(originalRequest)
            }).catch(err=>{
                return Promise.reject(error)
            })
        }

        return Promise.reject(error)
    });

    const onSuccess = function (response) {
        // console.log('Request Successful!', response);
        return response.data;
    };

    const onError = function (error) {
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

        return Promise.reject(error.response.data);
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

const postRequest = function (path, data, urlData = "", authorize=true) {
    console.log("Authorize",authorize);
    return request({
        url: path + urlData,
        method: 'POST',
        data: data
    }, null, authorize);
};

const postMultipartRequest = function (path, formData) {
    return request({
        url: path,
        method: 'POST',
        data: formData
    }, 'multipart/form-data');
};

const RequestType = {
    getRequest, postRequest, postMultipartRequest
};

export default RequestType


