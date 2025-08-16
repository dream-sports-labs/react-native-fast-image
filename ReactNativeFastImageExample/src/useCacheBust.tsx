import { useCallback, useState } from 'react'

const getNewKey = () => Math.random().toString();

export const useCacheBust = (
    url: string,
): { bust: () => void; url: string; query: string } => {
    const [key, setKey] = useState(getNewKey())
    const bust = useCallback(() => {
        setKey(getNewKey())
    }, [])
    const query = `?bust=${key}`
    return {
        url: `${url}${query}`,
        query,
        bust,
    }
}

export const useCacheArrayBust = (
    urls: string[],
): {bust: () => void; urls: string[]; queries: string[]} => {
    const [keys, setKeys] = useState(Array(urls.length).fill(getNewKey()))
    const bust = useCallback(() => {
        setKeys(Array(urls.length).fill(getNewKey()))
    }, [])
    const queries = keys.map(key => `?bust=${key}`)
    return {
        urls: urls.map((u, i) => `${u}${queries[i]}`),
        queries,
        bust,
    }
}