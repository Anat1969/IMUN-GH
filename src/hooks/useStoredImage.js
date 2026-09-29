import { useCallback, useEffect, useState } from 'react'
import { getImage, putImage, deleteImage, prepareImage } from '../lib/imageStore.js'

export function useStoredImage(key) {
  const [blob, setBlob] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let alive = true
    setBlob(null)
    getImage(key)
      .then((b) => alive && setBlob(b ?? null))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [key])

  useEffect(() => {
    if (!blob) return setUrl(null)
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])

  const save = useCallback(
    async (file) => {
      const prepared = await prepareImage(file)
      await putImage(key, prepared)
      setBlob(prepared)
    },
    [key],
  )

  const remove = useCallback(async () => {
    await deleteImage(key)
    setBlob(null)
  }, [key])

  return { url, save, remove }
}
