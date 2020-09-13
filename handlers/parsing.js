

export async function Parsing (data, proxy) {
    try {

        let arr = [];

        let index = 0;
        for (let row of data) {
            let text = row.text;
            let mod_index = index % 10;
            let i_proxy = proxy[mod_index];

            let dt = await getData(text, i_proxy);

            arr.push({name: text, data: dt});

            index ++;
        }

        return {status: true, data: arr}
    } catch (e) {
        return {status: false, err: e}
    }
}