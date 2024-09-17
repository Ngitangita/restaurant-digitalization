import axios from "axios";

export function setUp() {
    return axios.create({
        baseURL:"http://localhost:8086"
    })
}