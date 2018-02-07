const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));
const record = (name, ...results) => {
    console.log(`----------------${name}----------------`);
    for (const result of results) {
        console.log(result);
    }
    console.log('\n\n\n');
};

const tests = {
    'get': async (name) => {
        const get = await ajaxcp("https://jsonplaceholder.typicode.com/photos").request;

        record(name, get.json());
    },
    'delayed': async (name) => {
        const start = performance.now();
        const delayed = await ajaxcp("https://httpbin.org/delay/5").request;

        record(name, performance.now() - start, delayed.json());
    },
    'cancel early': async (name) => {
        const call = ajaxcp("https://httpbin.org/delay/5");
        await delay(2000);
        call.cancel();

        record(name, await call.request);
    },
    'json post': async (name) => {
        const response = await ajaxcp("https://httpbin.org/post", {post: [1, 2, 3, 4, {a: 12}]}).request;

        record(name, response.json());
    },
    'form data post': async (name) => {
        const formData = new FormData();
        formData.set("a", "testing");
        const response = await ajaxcp("https://httpbin.org/post", {post: formData}).request;

        record(name, response.json());
    },
    'timeout': async (name) => {
        try {
            const request = await ajaxcp("https://httpbin.org/delay/5", {timeout: 2000}).request;
            console.log("Failed: timeout\n\n\n");
        }
        catch (error) {
            record(name, error);
        }
    }
};
((...names) => {
    if (names.length === 0) {
        names = Object.keys(tests);
    }

    for (const name of names) {
        tests[name](name);
    }
})();
