$(document).ready(async function(){

    var sok = io.connect();

    const setStatus = (text, style) => {
        if (style == 'green') {
            $('#progress_bar').css({'color': 'green'});
        } else if (style == 'red') {
            $('#progress_bar').css({'color': 'red'});
        } else if (style == 'standart' || !style) {
            $('#progress_bar').css({'color': 'white'});
        }
        $('#progress_bar').text(text);
    }

    $(document).delegate("#upload_file", "change", (e) => {

        var formData = new FormData();
        formData.append('file', $('#upload_file')[0].files[0]);

        $.ajax({
            type: 'POST',
            url: '/saveexcel',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(data){
            if (data.ok){
                $('#upload_file').val('');
                setStatus('Файл загружен ...', 'green');
                sok.emit('start_parsing', {path_file: data.path});
            } else {
                console.log(data);
            }
        });
    });

    sok
    .on('open_connect', (msg) => {
        setStatus(msg.text, 'green');
    })
    .on('connect', () => {
        setStatus('Соединение с сервером установлено', 'green');
    })
    .on('disconnect', () => {
        setStatus('Соединение с серверов разорвано', 'red');
    })
    .on('reconnect_failed', () => {
        setStatus('Ошибка повторного соединения', 'red');
    })
    .on('transfer_data', (data) => {
        setStatus(data.text, 'green');
        console.log(data);
    });

});