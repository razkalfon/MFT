import axios from 'axios'
const baseurl='http://127.0.0.1:3000';

const Axiosinstance = axios.create({
    baseurl:baseurl,
    timeout:5000,
    headers:{
        "contant-type":"application/json",
        accept:"application/json"
    }
})

export default Axiosinstance