(() => {
    const ajaxp = (url, options) => {
        const requestObj = new XMLHttpRequest();
        const request = new Promise(
            (resolve, reject) => {
                const {
                    headers = {},
                    timeout = 0,
                    type = null,
                    onProgress = () => {},
                    token = null,
                    post = null
                } = (options || {});
                let postData = null;
                let method = "GET";

                if (post !== null) {
                    method = "POST";
                    if (FormData.prototype.isPrototypeOf(post) === false) {
                        postData = JSON.stringify(post)
                        headers["Content-Type"] = "application/json";
                    }
                    else {
                        postData = post;
                    }
                }

                if (type !== null) {
                    requestObj.responseType = type;
                }

                requestObj.addEventListener('error', reject);
                requestObj.addEventListener('timeout', reject);
                requestObj.addEventListener('abort', () => resolve(null));
                requestObj.addEventListener('progress', onProgress);
                requestObj.addEventListener(
                    'load',
                    () => {
                        //  Need compare 0 for cordova local file responses
                        if (requestObj.status === 0 || (requestObj.status >= 200 && requestObj.status < 300)) {
                            resolve({
                                status: requestObj.status,
                                statusText: requestObj.statusText,
                                url: requestObj.url,
                                json() {
                                    return JSON.parse(requestObj.responseText);
                                },
                                arrayBuffer() {
                                    return requestObj.response;
                                },
                                blob() {
                                    return requestObj.response;
                                },
                                text() {
                                    return requestObj.responseText;
                                }
                            });
                        }
                        else {
                            reject(new Error(`${requestObj.status}: ${requestObj.statusText}`));
                        }
                    }
                );

                try {
                    requestObj.open(method, url, true);
                    requestObj.timeout = timeout;
                    Object.entries(headers).forEach(
                        info => requestObj.setRequestHeader(info[0], info[1])
                    );
                    requestObj.setRequestHeader("Accept", "");
                    requestObj.setRequestHeader("Accept", "*/*");
                    requestObj.send(postData);
                }
                catch (error) {
                    reject(error);
                }
            }
        );
        return {
            request,
            cancel() {
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
