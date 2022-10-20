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

      addBtn.addEventListener('click', () => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none'
        // Show the prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            // User accepted the A2HS prompt
          } else {
            // User dismissed the A2HS prompt
          }
          deferredPrompt = null
        })
      })
    })
  }

  return (
    <div className='a2hs-button mx-auto'>
      <div className='flex items-center space-x-3'>
        <button className="text-xs inline-block w-max hover:underline" aria-label='Tap to add to home screen'>
          <img src='/logo.webp' className='w-16 inline-block' alt='Add To Home Screen Logo' />
          Download App
        </button>
      </div>
    </div>
  )
}

export default AddToHomeScreen
