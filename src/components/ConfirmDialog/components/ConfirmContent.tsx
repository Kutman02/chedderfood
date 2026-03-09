interface Props {
  message: string
}

export const ConfirmContent = ({ message }: Props) => {

  return (

    <div className="p-4">

      <p className="text-slate-600 mb-6">
        {message}
      </p>

    </div>

  )

}