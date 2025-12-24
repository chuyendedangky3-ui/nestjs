export const convertObjectToArray = (obj: object) => {
    return Object.keys(obj).map((key) => obj[key]);
};
