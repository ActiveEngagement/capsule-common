export default function promise(subject) {
    if(!(subject instanceof Function)) {
        subject = () => subject;
    }

    return new Promise((resolve, reject) => {
        const response = subject();
    
        if(response instanceof Promise) {
            response.then(resolve, reject);
        }
        else {
            resolve(response);
        }
    });
}
