export const ProfileSkeleton = () => {

  return (

    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header skeleton */}
      <div className="bg-white rounded-xl shadow border p-6 flex items-center gap-4">

        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />

        <div className="space-y-2">

          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />

          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />

          <div className="h-3 w-56 bg-gray-200 rounded animate-pulse" />

        </div>

      </div>


      {/* Form skeleton */}
      <div className="bg-white rounded-xl shadow border p-6 space-y-4">

        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />

        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />

        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />

        <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />

        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />

      </div>

    </div>

  )

}
