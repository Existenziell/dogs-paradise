import { supabase } from "./supabase"

export default async function updateProfile({ username, quote, avatar_url, setLoading }) {
  try {
    setLoading(true)
    const user = supabase.auth.user()

    const updates = {
      id: user.id,
      username,
      quote,
      avatar_url,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('users').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    setLoading(false)
    return true
  }
}
