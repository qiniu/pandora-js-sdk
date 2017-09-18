/*!
 * qiniu-js-sdk v@VERSION
 *
 * Copyright 2017 by Qiniu
 * Released under MIT License.
 *
 * GitHub: http://github.com/qiniu/js-sdk
 *
 * Date: @DATE
 */

(function (global) {

    function QiniuPandoraJsSDK() {

        /**
         * parse json string to javascript object
         * @param  {String} json string
         * @return {Object} object
         */
        this.parseJSON = function (data) {
            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            //var rx_one = /^[\],:{}\s]*$/,
            //    rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            //    rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            //    rx_four = /(?:^|:|,)(?:\s*\[)+/g,
            var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

            //var json;

            var text = String(data);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // todo 使用一下判断,增加安全性
            //if (
            //    rx_one.test(
            //        text
            //            .replace(rx_two, '@')
            //            .replace(rx_three, ']')
            //            .replace(rx_four, '')
            //    )
            //) {
            //    return eval('(' + text + ')');
            //}

            return eval('(' + text + ')');
        };

        // TODO: use mOxie
        /**
         * craete object used to AJAX
         * @return {Object}
         */
        this.createAjax = function (argument) {
            var xmlhttp = {};
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlhttp;
        };

        this.pushToPandoraPipeline = function(repoName, pandoraAuth, data) {

            if (typeof data !== "object") {
                throw new Error("typeof data must be object, instead of " + (typeof data));
            }
            if (data === null) {
                throw new Error("data cannot be null");
            }
            if (!(data instanceof Array)) {
                data = [data];
            }
            var protocolAndDomain;
            if (window.location.protocol === 'https:') {
                protocolAndDomain = "https://pipeline.qiniu.com";
            } else {
                protocolAndDomain = "http://pipeline.qiniu.com";
            }
            var url = protocolAndDomain + "/v2/repos/" + repoName + "/data";
            var ajax = this.createAjax();
            ajax.open('POST', url, true);
            ajax.setRequestHeader('Content-type', 'text/plain');
            ajax.setRequestHeader('Authorization', 'Pandora ' + pandoraAuth);

            var dataLines = [];
            for (var i = 0; i < data.length; ++ i) {
                var lineObj = data[i];
                var cells = [];
                for (var key in lineObj) {
                    cells.push(key + "=" + lineObj[key]);
                }
                dataLines.push(cells.join('\t'));
            }
            var textData = dataLines.join('\n');
            var that = this;

            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    var resultJSON;
                    try {
                        resultJSON = that.parseJSON(ajax.responseText);
                    } catch (e) {
                        resultJSON = null;
                    }
                    if (ajax.status === 200) {
                        console.debug("[STATISTICS] successfully push data to pandora pipeline.");
                    } else {
                        var errorMessage;
                        if (resultJSON && resultJSON["error"]) {
                            errorMessage = resultJSON["error"];
                        } else {
                            errorMessage = "unknown reason";
                        }
                        console.debug("[STATISTICS] push data to pandora pipeline failed with status " + ajax.status + " : " + errorMessage);
                    }
                }
            };
            ajax.send(textData);
        };
    }
    global.QiniuPandora = new QiniuPandoraJsSDK();
    global.QiniuPandoraJsSDK = QiniuPandoraJsSDK;

})(window);