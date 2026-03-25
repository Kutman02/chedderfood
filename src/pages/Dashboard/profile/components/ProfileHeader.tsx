import { useState, useEffect } from "react"

import {
  useUploadImageMutation,
  useUpdateProfileMutation
} from "@/api"

import type { Profile } from "../types/profile"

interface Props {
  profile: Profile
}

export const ProfileHeader = ({ profile }: Props) => {

  const [preview, setPreview] = useState<string | null>(null)

  const [uploadImage] = useUploadImageMutation()
  const [updateProfile] = useUpdateProfileMutation()

  // ✅ синхронизация preview при обновлении профиля
  useEffect(() => {
    setPreview(profile.avatar_url || null)
  }, [profile.avatar_url])

  const initials =
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    // ✅ проверка типа файла
    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {

      const res = await uploadImage(formData).unwrap()

      const avatarUrl = res?.source_url || null

      // ✅ сразу показываем
      setPreview(avatarUrl)

      await updateProfile({
        avatar_url: avatarUrl
      }).unwrap()

      console.log("Обновленный профиль:", res)

    } catch (error) {

      console.error("Ошибка загрузки аватара", error)
      alert("Ошибка загрузки изображения")

    }

  }

  const displayName =
    profile.first_name ||
    profile.display_name ||
    profile.username

  return (

    <div className="bg-white rounded-xl shadow border p-6 flex items-center gap-4">

      {/* Avatar */}
      <div className="relative">

        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 overflow-hidden">

          {preview ? (

            <img
              src={preview}
              alt="avatar"
              className="w-full h-full object-cover"
            />

          ) : (

            initials || profile.username?.[0]?.toUpperCase()

          )}

        </div>

        {/* Upload */}
        <label className="absolute -bottom-1 -right-1 bg-white border rounded-full p-1 cursor-pointer text-xs shadow">

          📷

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />

        </label>

      </div>

      {/* Info */}
      <div>

        <h2 className="text-xl font-bold">
          {displayName}
        </h2>

        <p className="text-sm text-gray-500">
          @{profile.username}
        </p>

        {profile.description && (
          <p className="text-sm text-gray-600 mt-1 max-w-md">
            {profile.description}
          </p>
        )}

      </div>

    </div>

  )
}