import {getDataExcel} from '../handlers/processing_file'
import {getData} from '../handlers/parsing_item'
import {getIps} from '../helpers/proxy'
import {Parsing} from '../handlers/parsing'
import path from 'path'

export default function (server, dir_path) {
    let io = require('socket.io').listen(server);
    io.sockets.on('connection', (socket) => {
        console.log('Пользователь подключен');

        socket.on('disconnect', () => {
            console.log('Пользователь отключился');
          });

        socket.emit('open_connect', {text: 'Соединение с сервером установлено'});

        socket.on('start_parsing', async (data) => {
            console.log('Парсинг начинается');
            let filename = path.join(dir_path, data.path_file);
            let arrData = await getDataExcel(filename);
            let arrProxy = await getIps();
            //let arr = await Parsing(arrData, arrProxy);

            let arr = [];
            let index = 0;
            for (let row of arrData) {
                let text = row.text;

                let mod_index = index % 10;
                let i_proxy = arrProxy[mod_index];

                let dt = await getData(text, i_proxy);

                arr.push({name: text, data: dt});

                socket.emit('transfer_data', {text: 'Данные обработаны', arr});

                index ++;
            }
        });
    });
}