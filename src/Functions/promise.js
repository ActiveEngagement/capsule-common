export default function promise(subject) {
    return Promise.resolve(
        typeof subject === 'function' ? subject() : subject
    );
}
