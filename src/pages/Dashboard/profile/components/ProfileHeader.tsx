import { useState } from "react"
import { useUploadImageMutation, useUpdateProfileMutation } from "@/app/services/api"
import type { Profile } from "../types/profile"

interface Props {
  profile: Profile
}

export const ProfileHeader = ({ profile }: Props) => {

  const [preview, setPreview] = useState<string | null>(null)

  const [uploadImage] = useUploadImageMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const initials =
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {

      // upload в WordPress media
      const res = await uploadImage(formData).unwrap()

      const avatarUrl = res.source_url || null

      setPreview(avatarUrl)

      // сохранить avatar в user meta
      await updateProfile({
        avatar_url: avatarUrl
      }).unwrap()

      console.log("Uploaded avatar:", res)

    } catch (error) {

      console.error("Ошибка загрузки аватара", error)

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

          {preview || profile.avatar_url ? (

            <img
              src={preview || profile.avatar_url || ""}
              alt="avatar"
              className="w-full h-full object-cover"
            />

          ) : (

            initials || profile.username?.[0]?.toUpperCase()

          )}

        </div>

        {/* Upload button */}
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

      {/* User info */}
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
