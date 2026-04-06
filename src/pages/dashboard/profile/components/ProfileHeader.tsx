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

  /* =========================
     STATE
  ========================= */

  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [uploadImage] = useUploadImageMutation()
  const [updateProfile] = useUpdateProfileMutation()

  /* =========================
     SYNC PROFILE → UI
  ========================= */

  useEffect(() => {
    setPreview(profile.avatar_url || null)
  }, [profile.avatar_url])

  /* =========================
     DERIVED DATA
  ========================= */

  const initials = (
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`
  ).toUpperCase()

  const fallbackInitial =
    profile.username?.[0]?.toUpperCase() || "?"

  const displayName =
    profile.first_name ||
    profile.display_name ||
    profile.username

  /* =========================
     UPLOAD HANDLER
  ========================= */

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения")
      return
    }

    setIsUploading(true)

    try {

      const res = await uploadImage({ file }).unwrap()

      const avatarUrl = res?.src

      if (!avatarUrl) {
        throw new Error("No avatar URL")
      }

      // 🔥 optimistic UI
      setPreview(avatarUrl)

      await updateProfile({
        avatar_url: avatarUrl
      }).unwrap()

    } catch (error) {

      console.error("Ошибка загрузки аватара", error)
      alert("Ошибка загрузки изображения")

    } finally {
      setIsUploading(false)
    }

  }

  /* =========================
     RENDER
  ========================= */

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

            initials || fallbackInitial

          )}

        </div>

        {/* Upload */}
        <label className={`
          absolute -bottom-1 -right-1
          bg-white border rounded-full p-1
          text-xs shadow
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}>

          📷

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
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