import { useCallback, useSyncExternalStore } from 'react'
import { subscribe, imageUrl, isAdmin, uploadImage, deleteImage } from '../lib/imageStore.js'

export function useStoredImage(key) {
  const url = useSyncExternalStore(subscribe, () => imageUrl(key))
  const canEdit = useSyncExternalStore(subscribe, isAdmin)

  const save = useCallback((file) => uploadImage(key, file), [key])
  const remove = useCallback(() => deleteImage(key), [key])

  return { url, canEdit, save, remove }
}
