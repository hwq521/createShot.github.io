var keyStr = 'ajseqwesz121!5'
var ivStr = '4566ai0qO23412312'

function decrypt(data, keyS, ivS) {
    let key = keyS || keyStr
    let iv = ivS || ivStr
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    return CryptoJS.DES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
}

function getQueryString(name) {
    var query_string = window.location.search;
    if (!query_string) return null; // 如果无参，返回null
    var re = /[?&]?([^=]+)=([^&]*)/g;
    var tokens;
    while (tokens = re.exec(query_string)) {
        if (decodeURIComponent(tokens[1]) === name) {
            return decodeURIComponent(tokens[2]);
        }
    }
    return null;
}

(function () {
    function init() {
        var code = getQueryString('c');
        if (code) {
            code = decrypt(code);
            code = parseInt(code, 16).toString(10)
            console.log(code)
            if (!isNaN(code) && new Date().getTime() < code) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    if (!init()) {
        document.head.innerHTML = ''
        document.body.innerHTML = '暂无权限访问'
    }
})();