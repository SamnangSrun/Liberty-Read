import BookImage from '@/Img/Index/Hero/book.png'; 

const HeroHome = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-[#444444]">
          Liberty Reads, <br /> Your Gateway To Great Books
        </h1>
        <p className="mt-4 text-base md:text-lg text-[#444444]">
          Discover a world of knowledge and imagination. Explore our collection, find your next great read, and let your journey begin.
        </p>
      </div>
      <div className="mt-6 md:mt-0 md:mr-20 mx-auto md:mx-0">
        <img 
          src={BookImage} 
          alt="Books" 
          className="w-56 sm:w-64 md:w-72 transform hover:scale-105 transition-transform duration-300 rounded-lg" 
        />
      </div>
    </div>
  );
};

export default HeroHome;
