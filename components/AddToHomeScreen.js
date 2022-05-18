import { useEffect } from 'react'

const AddToHomeScreen = () => {

  useEffect(() => {
    prompt()
  }, [])

  const prompt = () => {
    let deferredPrompt
    const addBtn = document.querySelector('.a2hs-button')
    addBtn.style.display = 'none'

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
      // Update UI to notify the user they can add to home screen
      addBtn.style.display = 'block'

      addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none'
        // Show the prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            // console.log('User accepted the A2HS prompt')
          } else {
            // console.log('User dismissed the A2HS prompt')
          }
          deferredPrompt = null
        })
      })
    })
  }

  return (
    <div className='a2hs-button button mx-auto'>
      <div className='flex items-center space-x-3'>
        <img src='/icons/paw-white.png' className='w-10 inline-block' alt='Add To Home Screen Logo' />
        <button className="text-xs inline-block w-max" aria-label='Tap to add to home screen'>Add to home screen</button>
      </div>
    </div>
  )
}

export default AddToHomeScreen
