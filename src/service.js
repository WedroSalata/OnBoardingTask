import { storage } from "@forge/api"

export const setPublicStorage = async (key,any) => {
    await storage.set(key, any)
}
export const getPublicStorage = async (key) => {
    let data = await storage.get(key)
    return data
}
export const removePublicStorage = async (key) => {
    await storage.delete(key)
}

