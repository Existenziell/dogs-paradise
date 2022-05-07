import { useUser } from '@auth0/nextjs-auth0';

export const LoginBtn = () => {
  const { user } = useUser()

  return (

    <a href={user ? `/profile` : `/api/auth/login`} className="mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </a>
  )
}
