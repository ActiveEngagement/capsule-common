import { promise } from '..';

export default function modules(obj) {
    return Object.entries(obj)
        .map(([key, value]) => {
            return promise(value).then(value => {
                return [key, value.default || value];                       
            });
        });
}