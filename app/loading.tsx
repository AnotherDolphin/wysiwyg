import CircularProgress from "@mui/material/CircularProgress"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CircularProgress />
    </div>
  )
}
