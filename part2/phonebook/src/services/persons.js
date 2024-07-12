import axios from 'axios'
const baseUrl = 'http://localhost:3002/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const deleteOne = id => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const update = (object) => {
    return axios.put(`${baseUrl}/${object.id}`, object).then(response => response.data)
}

/*const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}*/

export default {getAll, create, deleteOne, update}