import { useUser } from '@auth0/nextjs-auth0'
import { LogoutBtn } from '../components/LogoutBtn'
import Head from 'next/head'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import PacmanLoader from 'react-spinners/PacmanLoader'

const Profile = ({ i18n }) => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div className='pt-32'><PacmanLoader color={'white'} size={30} /></div>
  if (error) return <div className='pt-32'><div>{error.message}</div></div>

  if (user) {
    return (
      <>
        <Head>
          <title>{i18n.title}</title>
          <meta name='description' content={i18n.desc} />
        </Head>

        <div className='pt-24 px-8'>
          <h1 className='text-6xl mb-12'>{i18n.T1}</h1>
          <h2 className='text-left mb-2'>Your Membership Card:</h2>
          <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <img src={user.picture} className='rounded-xl border-4 border-white ' />
              </div>
              <div className='flex flex-col h-full gap-4'>
                <div className='text-right  bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-max self-end'>
                  <p className='text-2xl md:text-4xl'>{user.name}</p>
                  <p className='text-sm'>{user.nickname}</p>
                </div>
                <div className='text-right text-xs'>
                  <p className='text-xs'>Member since: {user.updated_at.slice(0, 10)}</p>
                  <p>Member status: Free</p>
                </div>

                <div className='flex justify-end gap-4'>
                  <img src='/img/dogs/dog1.jpg' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
                  <img src='/img/dogs/dog2.jpg' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
                </div>
              </div>
            </div>
          </div>

          <LogoutBtn />
        </div>
      </>

    )
  }

  return (
    <div className='pt-24'>
      <h1 className='text-2xl mb-4'>Please login to proceed</h1>
      <a href="/api/auth/login" className='link'>Login</a>
    </div>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.profile :
    i18n = langES.profile
  return {
    props: { i18n },
  }
}

export default Profile
