import { useGetProfileQuery } from "@/app/services/api"

import { ProfileHeader } from "../components/ProfileHeader"
import { ProfileForm } from "../components/ProfileForm"
import { ProfileSkeleton } from "../components/ProfileSkeleton"

const ProfilePage = () => {

  const {
    data: profile,
    isLoading,
    isError
  } = useGetProfileQuery(null)

  if (isLoading) return <ProfileSkeleton />

  if (isError || !profile) {
    return (
      <div className="p-6 text-red-500">
        Ошибка загрузки профиля
      </div>
    )
  }

  return (

    <div className="p-6 max-w-3xl mx-auto">

      <ProfileHeader profile={profile} />

      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>

    </div>

  )

}

export default ProfilePage
