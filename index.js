var accounts = require('./accounts');
var querystring = require('querystring');
var moment = require('moment');
var axios = require('axios');
var server = require('server');
var localStorage = require('localStorage')
var express = require('express');
var bodyParser = require('body-parser');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static("./public"));
app.use(function(req,res,next){
	next();
})
var server = require("http").Server(app);

app.set("view engine","ejs");
app.set("views","./views");
server.listen(process.env.PORT || 3001,()=>{
    console.log('server chạy');
});
// let day = moment().add(1, 'd').format("YYYY-MM-DD");
var request = require('request');



let day = moment().add(1, 'd').format("YYYY-MM-DD");
     datcom =async() =>{ 
    if(new Date().toLocaleString("en-US", {timeZone: "America/Ho_Chi_Minh"}).getDay() === 5) {
        day = moment().add(3, 'd').format("YYYY-MM-DD");
    } else {
        day = moment().add(1, 'd').format("YYYY-MM-DD");
    }
    for (let i = 0; i < accounts.length; i++) {
        let cookie, headers, response;
        try {
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

            response = await axios.post(
                'https://erp.nhanh.vn/user/signin', 
                querystring.stringify(accounts[i]), 
                {
                    headers: headers,
                }
            );
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
check();
setInterval(() => {
    check();
}, 60*60*1000);

function check(){
    var h = new Date().toLocaleString("en-US", {timeZone: "America/Ho_Chi_Minh"}).getHours();
    console.log('check lúc'+h);
    if(new Date().toLocaleString("en-US", {timeZone: "America/Ho_Chi_Minh"}).getDay() !== 6) {
        if(new Date().toLocaleString("en-US", {timeZone: "America/Ho_Chi_Minh"}).getHours()==9){
            datcom();
        }
    }
}

