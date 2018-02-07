# ajaxp
> Small promise-based ajax library with a reasonable (hopefully) cancel mechanic

```javascript
ajaxcp(url, [options]) -> {request : Promise, cancel : function}
```

## ajaxcp
> Executes an ajax request to the given url. Returns an object with the request promise and a cancel method.
> The request promise resolves to a response object on success, or `null` if canceled before completion.
