var querystring = require('querystring');
var moment = require('moment');
var axios = require('axios');
var server = require('server');
var accounts = require('./accounts');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

let day = moment().add(1, 'd').format("YYYY-MM-DD");
// console.log(new Date().getDay());
async function datcom() {
    if(new Date().getDay() === 5) {
        day = moment().add(3, 'd').format("YYYY-MM-DD");
    } else {
        day = moment().add(1, 'd').format("YYYY-MM-DD");
    }
    // console.log('day to order: ', day);
    for (let i = 0; i < accounts.length; i++) {
        // console.log('order for account: ', accounts[i]);
        let cookie, headers, response;
        try {
            // console.log('open erp');
            response = await axios({
                method: 'get',
                withCredentials: true,
                rejectUnauthorized: false,
                url: 'https://erp.nhanh.vn/',
            });

            cookie = response.headers['set-cookie'][0];
            headers = {
                'Cookie': cookie,
            }
            // console.log('sign in');
            response = await axios.post(
                'https://erp.nhanh.vn/user/signin', 
                querystring.stringify(accounts[i]), 
                {
                    headers: headers,
                }
            );
            // console.log('hi',response); 
            // console.log('add lunch',cookie);
            headers = {
                'Cookie': cookie,
            };
            response = await axios({
                data:'',
                method: 'get',
                withCredentials: true,
                url: 'https://erp.nhanh.vn/hrm/lunch/add',
                headers: headers,
            });
            let start= response.data.indexOf("checksum = '")+12; 
            var checksums =(response.data.slice(start,start+32));
            // console.log(checksums);
            response = await axios({
                data:querystring.stringify({'sittingPosition':'101','checksum':checksums,'bookDate[]':day.toString()}),
                method: 'post',
                withCredentials: true,
                url: 'https://erp.nhanh.vn/hrm/lunch/add',
                headers: headers,
            });
            if(response.data.code===1){
                console.log('Đặt cơm thành công cho '+accounts[i].username);
            }else{
                console.log('có lỗi xảy ra với tài khoản ' +accounts[i].username);
            }

        }
        catch (error) {
            console.log('order error: ', error);
        }
    }
}
if(new Date().getDay() !== 6) {
datcom();
}