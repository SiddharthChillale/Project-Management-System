// I hate try...catch blocks, as well as .then().catch() methods.
// So I created this wrapper that gives me error as follows:
// [data, error] = await anyFunctionCall();
// if anyFunctionCall throws, the error is captured in variable 'error'
// and anything returned by the function is captured in variable 'data'
// This way error handling is less cluttered.
// This method is used for error handling in go. for more information read here: https://www.5error.com/go-style-error-handling-in-javascript/
export function goStyleExceptionWrapper(fn) {
    return async function (...args) {
        try {
            const result = await fn(...args);
            return [result, null];
        } catch (err) {
            return [null, err];
        }
    };
}
