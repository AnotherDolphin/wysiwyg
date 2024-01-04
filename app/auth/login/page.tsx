"use client"

import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'


export default function Page() {
  const router = useRouter();
  // const { email } = router;
  // const { data: session } = useSession()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user!.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }
  
  return (
    <div>
      Not signed in <br />
      <button onClick={() => {}}>Sign in</button>
      {email}
    </div>
  )
}
