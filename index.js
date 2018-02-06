"use strict";

(function () {
    var ajaxp = function ajaxp(url, options) {
        var requestObj = new XMLHttpRequest();
        var request = new Promise(function (resolve, reject) {
            var _ref = options || {},
                _ref$headers = _ref.headers,
                headers = _ref$headers === undefined ? {} : _ref$headers,
                _ref$timeout = _ref.timeout,
                timeout = _ref$timeout === undefined ? 0 : _ref$timeout,
                _ref$type = _ref.type,
                type = _ref$type === undefined ? null : _ref$type,
                _ref$onProgress = _ref.onProgress,
                onProgress = _ref$onProgress === undefined ? function () {} : _ref$onProgress,
                _ref$token = _ref.token,
                token = _ref$token === undefined ? null : _ref$token,
                _ref$post = _ref.post,
                post = _ref$post === undefined ? null : _ref$post;

            var postData = null;
            var method = "GET";

            if (post !== null) {
                method = "POST";
                if (FormData.prototype.isPrototypeOf(post) === false) {
                    postData = JSON.stringify(post);
                    headers["Content-Type"] = "application/json";
                } else {
                    postData = post;
                }
            }

            if (type !== null) {
                requestObj.responseType = type;
            }

            requestObj.addEventListener('error', reject);
            requestObj.addEventListener('timeout', reject);
            requestObj.addEventListener('abort', function () {
                return resolve(null);
            });
            requestObj.addEventListener('progress', onProgress);
            requestObj.addEventListener('load', function () {
                //  Need compare 0 for cordova local file responses
                if (requestObj.status === 0 || requestObj.status >= 200 && requestObj.status < 300) {
                    resolve({
                        status: requestObj.status,
                        statusText: requestObj.statusText,
                        url: requestObj.url,
                        json: function json() {
                            return JSON.parse(requestObj.responseText);
                        },
                        arrayBuffer: function arrayBuffer() {
                            return requestObj.response;
                        },
                        blob: function blob() {
                            return requestObj.response;
                        },
                        text: function text() {
                            return requestObj.responseText;
                        }
                    });
                } else {
                    reject(new Error(requestObj.status + ": " + requestObj.statusText));
                }
            });

            try {
                requestObj.open(method, url, true);
                requestObj.timeout = timeout;
                Object.entries(headers).forEach(function (info) {
                    return requestObj.setRequestHeader(info[0], info[1]);
                });
                requestObj.setRequestHeader("Accept", "");
                requestObj.setRequestHeader("Accept", "*/*");
                requestObj.send(postData);
            } catch (error) {
                reject(error);
            }
        });
        return {
            request: request,
            cancel: function cancel() {
                requestObj.abort();
            }
        };
    };

    if (typeof window !== 'undefined') {
        window.ajaxp = ajaxp;
    }
    if (typeof module !== 'undefined') {
        module.exports = ajaxp;
    }
})();
