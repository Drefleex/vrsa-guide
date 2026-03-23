import { useState, useCallback } from 'react'

const STORAGE_KEY = 'vrsa_photos'
const MAX_SIZE    = 800   // px max dimension
const QUALITY     = 0.75  // jpeg quality

// ─── Load / Save ─────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function save(store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
}

// ─── Compress image to base64 ─────────────────────────────────
function compress(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE }
        else                { width = Math.round(width * MAX_SIZE / height);  height = MAX_SIZE }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', QUALITY))
    }
    img.onerror = reject
    img.src = url
  })
}

// ─── Hook ────────────────────────────────────────────────────
export function usePhotos() {
  const [store, setStore] = useState(load)

  const getPhoto = useCallback((id) => store[String(id)] || null, [store])

  const setPhoto = useCallback(async (id, file) => {
    const b64 = await compress(file)
    setStore(prev => {
      const next = { ...prev, [String(id)]: b64 }
      save(next)
      return next
    })
    return b64
  }, [])

  const deletePhoto = useCallback((id) => {
    setStore(prev => {
      const next = { ...prev }
      delete next[String(id)]
      save(next)
      return next
    })
  }, [])

  return { getPhoto, setPhoto, deletePhoto }
}