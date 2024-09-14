export function cleanDeep(obj) {
    if (Array.isArray(obj)) {
        return obj
            .map(cleanDeep)
            .filter(
                (item) =>
                    item !== null &&
                    item !== undefined &&
                    item !== "" &&
                    !(Array.isArray(item) && item.length === 0)
            );
    } else if (typeof obj === "object" && obj !== null) {
        return Object.keys(obj).reduce((acc, key) => {
            const value = cleanDeep(obj[key]);
            if (
                value !== null &&
                value !== undefined &&
                value !== "" &&
                !(typeof value === "object" && Object.keys(value).length === 0)
            ) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    return obj;
}
