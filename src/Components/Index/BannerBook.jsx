import React from 'react'

const BannerBookComponents = () => {
  return (
    <header>
    <section
      className={`relative bg-[url(./Img/Index/bookcover.png)] bg-cover w-full bg-center h-[300px] `}
    >
       
      <div className="relative  px-4 py-32 sm:px-6 text-center  lg:items-center lg:px-8">
        
          <h1 className="text-3xl  text-white sm:text-5xl">
            Liberty Shop - Where Books Are Affordable
          </h1>
        
      </div>
    </section>
     <div>
        
        
     <div className="text-center py-8 px-4 max-w-4xl mx-auto">
        <p className="text-sm font-bold text-black mb-2">Liberty Reads Books</p>
        <h1 className="text-2xl font-bold text-[#102249] mb-3">Books</h1>
        <h3 className="text-[#667085] mb-6">
          Let's join our famous class, the knowledge provided will definitely be useful for you.
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Children's Books",
            "Non-Fiction",
            "Fiction",
            "Health & Lifestyle",
          ].map((category) => (
            <h2 key={category} className="text-sm font-bold text-black">
              {category}
            </h2>
          ))}
        </div>
      </div>
        
     
    </div>
  </header>
  )
}

export default BannerBookComponents