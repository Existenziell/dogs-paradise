import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Clients from '../components/admin/Clients'
import Dogs from '../components/admin/Dogs'

const Index = ({ clients, dogs }) => {
  return (

    <>
      <Head>
        <title>Admin | Dog's Paradise</title>
        <meta name='description' content="Admin | Dog's Paradise" />
      </Head>

      <div className='py-8 dark:text-brand'>
        <Clients clients={clients} />
        <Dogs dogs={dogs} />
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const { data: clients } = await supabase.from('users').select(`*, dogs(name)`).order('name', { ascending: true })
  const { data: dogs } = await supabase.from('dogs').select(`*, users(name)`).order('id', { ascending: true })

  return {
    props: { clients, dogs },
  }
}

export default Index
