
export const baseUrl = 'http://127.0.0.1:65472/api/v1';
export const ossUrl = baseUrl;

export const jwt = {
    value: ""
};

export function U(url) {
    return `${baseUrl}${url}`;
}
// ---------------------------------------

// export default baseUrl;
