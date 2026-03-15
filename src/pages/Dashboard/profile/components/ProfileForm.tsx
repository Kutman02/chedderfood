import { useState } from "react"
import { useUpdateProfileMutation } from "@/app/services/api"

import type { Profile } from "../types/profile"

interface Props {
  profile: Profile
}

export const ProfileForm = ({ profile }: Props) => {

  const [firstName, setFirstName] = useState(profile.first_name || "")
  const [lastName, setLastName] = useState(profile.last_name || "")
  const [description, setDescription] = useState(profile.description || "")

  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    try {

      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        description
      }).unwrap()

      alert("Профиль обновлен")

    } catch (error) {

      console.error("Ошибка обновления профиля", error)
      alert("Ошибка обновления")

    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow border p-6 space-y-4"
    >

      <h3 className="text-lg font-semibold">
        Редактировать профиль
      </h3>

      {/* Имя */}
      <div className="flex flex-col gap-1">

        <label className="text-sm font-medium">
          Имя
        </label>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border rounded-lg p-2"
        />

      </div>


      {/* Фамилия */}
      <div className="flex flex-col gap-1">

        <label className="text-sm font-medium">
          Фамилия
        </label>

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border rounded-lg p-2"
        />

      </div>


      {/* Биография */}
      <div className="flex flex-col gap-1">

        <label className="text-sm font-medium">
          Биография
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-lg p-2 min-h-100px"
        />

      </div>


      {/* Кнопка */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >

        {isLoading ? "Сохранение..." : "Сохранить изменения"}

      </button>

    </form>

  )

}
