import axios from "axios";

const baseURL = "http://localhost:8086"; 

export const axiosConf = axios.create({
    baseURL,
});

export const apiUrl = (path) => {
    return `${baseURL}${path}`; 
};

export const fetchData = async (path, method = 'GET', data = null) => {
    try {
        const response = await axiosConf.request({
            url: path,
            method,
            data,
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};



export async function fetchJson(url, method = 'GET', data = null, headers = {}) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      if (response.status === 204) {
        return; 
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
  