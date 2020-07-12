import React from "react";
import axios from "axios"
import history from "../helpers/history";
import {getAccessToken, getRefreshToken} from "../helpers/tokens";
import Cookies from "js-cookie";
import API from "./API";

const request = async function (options, contentType) {

    const client = axios.create({
        baseURL: true ? "http://localhost:8080/" : "https://www.traveldirection.ax.lt:8080/",
        headers: {
            'Content-Type': (contentType == null) ? 'application/json' : contentType,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer " + getAccessToken()
            }
    });



    // Add a response interceptor
    client.interceptors.response.use(function (response) {
        return response;
    },  function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const originalRequest = error.config;
        const url = originalRequest.url;
        const status = error.response.status;

        //Do not request for new JWT if response code is not Authorized
        if (status !== 403) {
            Promise.reject(error);
            return
        }


        // Logout user if token refresh didn't work or user is disabled
        if (url === 'api/v1/auth/refresh') {
            console.log("Asking for refresh token");
            console.log("Unable to issue new JWT token. Redirecting to login page!");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            history.push("/login");
            Promise.reject(error);
            return
        }else if(url.startsWith("api/v1/auth")){
            Promise.reject(error);
            return
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
            }).catch(error=>{
                console.log("Err");
                return Promise.reject()
            })
        }

        Promise.reject(error)
    });

    const onSuccess = function (response) {
        // console.log('Request Successful!', response);
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
    console.log(data)
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


