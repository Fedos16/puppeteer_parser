import axios from 'axios';

const URL = 'https://proxy-store.com/api/';
const API_KEY = '560493164d75af09f06602f112b3179d';
const METHOD_REQUEST = 'GET'; 

async function getDataFromAPI() {
    try {
        let data = await axios.get(`${URL}${API_KEY}/getproxy`);
        return data;
    } catch (e) {
        throw e;
    }
}

export async function getIps() {
    try {
        let data = await getDataFromAPI();

        let statusIps = data.data.status;

        let arr = [];

        if (statusIps == 'ok') {
            let list = data.data.list;
            for (let item of Object.keys(list)) {
                let row = list[item];
                arr.push({ip: row.ip, port: row.port, user: row.user, pass: row.pass});
            }
            return arr;
        } else {
            return false;
        }

    } catch (e) {
        throw e;
    }
}