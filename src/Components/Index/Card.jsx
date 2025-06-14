
const PropsCardComponents = ({
  
  imageSrc,
  title,
  director,
  genre,
  price,
  onAddToCart,
  isAdding
}) => {
  return (
    <div className="block rounded-lg p-1 sm:p-2 md:p-3 lg:p-4 shadow-sm shadow-indigo-100 hover:shadow-md transition-shadow duration-300 text-[10px] sm:text-xs md:text-sm lg:text-base">
      <img
        alt={title}
        src={imageSrc}
        className="w-full rounded-md object-cover h-40 sm:h-32 md:h-48 lg:h-[400px]"
      />

      <div className="mt-1 sm:mt-2 md:mt-3 lg:mt-4">
        <div className="text-center">
          <h2 className="font-medium text-[10px] sm:text-xs md:text-sm lg:text-lg line-clamp-1">{title}</h2>
          <div className="flex justify-between mt-1 sm:mt-2">
            <div className="text-start">
              <p className="text-[9px] sm:text-xs text-gray-600"> {director}</p>
              <p className="text-[8px] sm:text-xs text-gray-500">{genre}</p>
            </div>
            <div className="text-end">
              <p className="text-[10px] sm:text-sm md:text-base font-bold text-[#102249]">{price}$</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 sm:mt-2 md:mt-4">
        <button
          onClick={onAddToCart}
          disabled={isAdding}
          className={`w-full px-1 py-1 sm:px-2 sm:py-1 md:px-4 md:py-2 rounded border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#102249] focus:ring-opacity-50
            ${isAdding
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'text-black hover:text-white border-black hover:bg-[#102249]'
            }`}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default PropsCardComponents;
