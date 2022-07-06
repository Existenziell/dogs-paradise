import { EmojiHappyIcon } from '@heroicons/react/outline'

export default function Extras({ slug, calculatePrice }) {
  switch (slug) {

    case 'spa':
      return (
        <div className='border p-4 rounded-sm mt-2 flex flex-col gap-1 items-start w-full'>
          <p className='mb-2 text-left text-xl'>Available extras:</p>
          <label htmlFor="extraCut" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraCut"
              name="Extra Cut"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={50}
            /> With cut (50 MXN)
          </label>
          <label htmlFor="extraTooth" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraTooth"
              name="Tooth Brushing"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Tooth Brushing (100 MXN)
          </label>
          <label htmlFor="extraNails" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraNails"
              name="Nail cutting"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Nail cutting (100 MXN)
          </label>
          <label htmlFor="extraShampoo" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraShampoo"
              name="Medicinal Shampoo"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Medicinal Shampoo (100 MXN)
          </label>
          <label htmlFor="extraKnots" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraKnots"
              name="Knots Removal"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Knots Removal (100 MXN)
          </label>
          <label htmlFor="extraHair" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraHair"
              name="Dead Hair Removal"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={50}
            /> Dead Hair Removal (50 MXN)
          </label>
          <label htmlFor="extraGame" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraGame"
              name="2 Additional game hours"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={50}
            /> 2 Additional game hours (50 MXN)
          </label>
        </div>
      )

    case 'hotel':
      return (
        <div className='border p-4 rounded-sm mt-2 flex flex-col gap-1 items-start w-full'>
          <p className='mb-2 text-left text-xl'>Available extras:</p>
          <div className='mb-2 text-left'>
            <div className='flex items-center justify-start gap-4' onChange={calculatePrice}>
              <p className=''>Room size:</p>
              <label htmlFor='normal' className='cursor-pointer block'>
                <input
                  type="radio"
                  name='Room Size'
                  id='normal'
                  // name="Room Size Normal"
                  defaultChecked={true}
                  className='calculate'
                  value={0}
                /> Normal
              </label>
              <label htmlFor='big' className='cursor-pointer'>
                <input
                  type="radio"
                  name='Room Size'
                  id='big'
                  // name="Room Size Big"
                  defaultChecked={false}
                  className='calculate'
                  value={50}
                /> Big (+ 50 MXN)
              </label>
              <label htmlFor='vip' className='cursor-pointer'>
                <input
                  type="radio"
                  name='Room Size'
                  id='vip'
                  // name="Room Size VIP"
                  defaultChecked={false}
                  className='calculate'
                  value={150}
                /> VIP (+ 150 MXN)
              </label>
            </div>
            <label htmlFor="extraCut" className="cursor-pointer flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="extraCut"
                name="More than 7 nights requested"
                className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              /> More than 7 nights (If selected, we can offer you a better quote.)
            </label>

          </div>

        </div>
      )

    case 'walker':
      return (
        <div className='border p-4 rounded-sm mt-2 flex flex-col gap-1 items-start w-full'>
          <p className='mb-2 text-left text-xl'>Available extras:</p>
          <label htmlFor="extraCut" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraCut"
              name='Solo Walk'
              value={80}
              onChange={calculatePrice}
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
            /> Solo Walk - All eyes on your dog (80 MXN)
          </label>
        </div>
      )

    case 'grooming':
      return (
        <div className='border p-4 rounded-sm mt-2 flex flex-col gap-1 items-start w-full'>
          <p className='mb-2 text-left text-xl'>Available extras:</p>
          <label htmlFor="extraCut" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraCut"
              name="Extra Cut"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={50}
            /> With cut (50 MXN)
          </label>
          <label htmlFor="extraTooth" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraTooth"
              name="Tooth Brushing"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Tooth Brushing (100 MXN)
          </label>
          <label htmlFor="extraNails" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraNails"
              name="Nail cutting"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Nail cutting (100 MXN)
          </label>
          <label htmlFor="extraShampoo" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraShampoo"
              name="Medicinal Shampoo"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Medicinal Shampoo (100 MXN)
          </label>
          <label htmlFor="extraKnots" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraKnots"
              name="Knots Removal"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={100}
            /> Knots Removal (100 MXN)
          </label>
          <label htmlFor="extraHair" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraHair"
              name="Dead Hair Removal"
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              onChange={calculatePrice}
              value={50}
            /> Dead Hair Removal (50 MXN)
          </label>
        </div>
      )

    case 'day-care':
      return (
        <div className='border p-4 rounded-sm mt-2 flex flex-col gap-1 items-start w-full'>
          <p className='mb-2 text-left text-xl'>Available extras:</p>
          <label htmlFor="extraCut" className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              id="extraCut"
              name='+4h'
              onChange={calculatePrice}
              value={40}
              className="calculate text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
            /> Double pack +4h (40 MXN)
          </label>
        </div>
      )

    case 'veterinary':
      return (
        <div className='border border-cta p-4 rounded-sm mt-2 w-full flex items-center gap-2 justify-center'>
          <p>Members get 1 free per month!</p>
          <EmojiHappyIcon className='w-6 relative bottom-[1px]' />
        </div>
      )

    case 'psychology':
      return (
        <div className='border border-cta p-4 rounded-sm mt-2 w-full flex items-center gap-2 justify-center'>
          This service is free for Members <EmojiHappyIcon className='w-6 relative bottom-[1px]' />
        </div>
      )

    default:
      return <div></div>
  }
}
