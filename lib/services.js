export const services = [
  {
    title: 'Day Spa',
    desc: 'The preferred way to pamper your four-legged family member!',
    img: '/icons/services/spa.png',
    slug: 'spa',
    prices:
      <div className="flex flex-col">
        <span>Small w/o cut: 350 (Members: 250)</span>
        <span>Small w/ cut: 400 (Members: 300)</span>
        <span>Medium Dog w/o cut: 400 (Members: 300)</span>
        <span>Medium Dog w/ cut: 450 (Members: 350)</span>
        <span>Big dog w/o cut: 450 (Members: 350)</span>
        <span>Big dog w/ cut: 500 (Members: 400)</span>
      </div>,
    isNew: false
  },
  {
    title: 'Dog Walking',
    desc: 'Your dog walker can stop by as many times as you need – on whatever days you need them.',
    img: '/icons/services/walker.png',
    slug: 'walker',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Small dog 1h:</span> 150 (Members: 100)</p>
        <p><span>Big dog 1h:</span> 200 (Members: 150)</p>
        <p><span>Small dog 2h:</span> 250 (Members: 200)</p>
        <p><span>Big dog 2h:</span> 300 (Members: 250)</p>
      </div>,
    isNew: false
  },
  {
    title: 'Canine Hotel',
    desc: 'Our canine hotel is unique, it has rooms with climate and even a ball pool.',
    img: '/icons/services/hotel.png',
    slug: 'hotel',
    prices:
      <div className="flex flex-col gap-1">
        <p>Small dog:<span> 350 (Members: 280)</span></p>
        <p>Big dog 1h:<span> 400 (Members: 300)</span></p>
      </div>,
    isNew: false
  },
  {
    title: 'Grooming',
    desc: "Each dog's service is personalized to their needs.",
    img: '/icons/services/grooming.png',
    slug: 'grooming',
    prices:
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col">
          <span>Small w/o cut: 250 (Members: 180)</span>
          <span>Medium w/o cut: 300 (Members: 200)</span>
          <span>Big w/o cut: 350 (Members: 250)</span>
        </div>
        <div className="flex flex-col">
          <span>Small w/ cut: 300 (Members: 250)</span>
          <span>Medium w/ cut: 350 (Members: 280)</span>
          <span>Big w/ cut: 400 (Members: 300)</span>
        </div>
      </div>,
    isNew: false
  },
  {
    title: 'Nursery',
    desc: "A place where young dogs are cared for.",
    img: '/icons/services/nursery.png',
    slug: 'nursery',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Small dog 4h:</span> 250 (Members: 180)</p>
        <p><span>Big dog 4h:</span> 250 (Members: 200)</p>
        <p><span>Small dog 8h:</span> 270 (Members: 220)</p>
        <p><span>Big dog 8h:</span> 300 (Members: 250)</p>
      </div>,
    isNew: false
  },
  {
    title: 'Tooth brushing',
    desc: "Lorem Ipsum",
    img: '/icons/services/tooth.png',
    slug: 'tooth-brushing',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 100</p>
        <p><span>Members:</span> 50</p>
      </div>,
    isNew: false
  },
  {
    title: 'Nail Cutting',
    desc: "Lorem Ipsum",
    img: '/icons/services/nails.svg',
    slug: 'nail-cutting',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 100</p>
        <p><span>Members:</span> 50</p>
      </div>,
    isNew: false
  },
  {
    title: 'Medicinal Shampoo',
    desc: "Lorem Ipsum",
    img: '/icons/services/shampoo.png',
    slug: 'medicinal-shampoo',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 100</p>
        <p><span>Members:</span> 50</p>
      </div>,
    isNew: false
  },
  {
    title: 'Veterinary',
    desc: "Lorem Ipsum",
    img: '/icons/services/veterinary.png',
    slug: 'veterinary',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 200</p>
        <p><span>Members:</span> 1 free per month!</p>
      </div>,
    isNew: false
  },
  {
    title: 'Dog Psychology',
    desc: "Lorem Ipsum",
    img: '/icons/services/psychology.png',
    slug: 'psychology-evaluation',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 200</p>
        <p><span>Members:</span> Free</p>
      </div>,
    isNew: false
  },
  {
    title: 'Hotel VIP',
    desc: "Lorem Ipsum",
    img: '/icons/services/vip.png',
    slug: 'hotel-vip',
    prices:
      <div className="flex flex-col gap-1">
        <p><span>Normal:</span> 500</p>
        <p><span>Members:</span> 400</p>
      </div>,
    isNew: false
  },
]
