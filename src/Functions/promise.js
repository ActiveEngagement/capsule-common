export default function promise(subject) {
    const response = typeof subject === 'function' ? subject() : subject;

    return new Promise((resolve, reject) => {
        if(response instanceof Promise) {
            response.then(resolve, reject);
        }
        else {
            resolve(response);
        }
    });
}
