interface Props {
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ message = 'Laden...', fullScreen = false }: Props) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-brand-black'
    : 'min-h-[60vh] flex items-center justify-center'

  return (
    <div className={wrapper}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin" />
        <p className="font-ui text-sm text-brand-muted">{message}</p>
      </div>
    </div>
  )
}
