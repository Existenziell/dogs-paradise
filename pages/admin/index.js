import useApp from '../../context/AppContext'
import Head from 'next/head'
import Auth from '../../components/Auth'
import Nav from '../../components/admin/Nav'

const Admin = () => {
  const { session, currentUser } = useApp()

  if (!session || !currentUser) return <Auth />
  if (currentUser?.roles?.name !== 'Admin') return <Auth />

  return (
    <>
      <Head>
        <title>Admin | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <h1 className='text-4xl mt-8'>Admin Control</h1>
        <p className='text-sm mt-2'>Remember, with great power comes great responsibility.</p>
        <p className='text-sm'>Please use the menu to navigate to the different sections</p>
      </div>
    </>
  )
}

export default Admin
