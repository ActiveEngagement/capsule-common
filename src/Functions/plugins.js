import { promise } from '..';

export default function plugins(arr) {
    const promises = arr.map(module => {
        return promise(Array.isArray(module) ? module[0] : module);
    });

    const args = arr.map(module => {
        return Array.isArray(module) ? module[1] : undefined;
    });
    
    return Promise.all(promises).then(modules => {
        return modules.map((module, i) => {
            return [module.default || module, args[i]]
        });
    });
}