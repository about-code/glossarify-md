export function whenTrue(predicate, plugin) {
    if (predicate) {
        return plugin;
    } else {
        return;
    }
}
