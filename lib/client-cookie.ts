import Cookies from "js-cookie";

export const StoreCookie = (key: string, plainText: string) => {
    Cookies.set(key, plainText, { expires: 1})
}

export const GetCookie = (key: string) => {
    return Cookies.get(key);
}

export const removeCookie = (key: string) => {
    Cookies.remove(key);
}