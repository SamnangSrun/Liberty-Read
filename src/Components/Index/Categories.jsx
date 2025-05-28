// import childrenBooksImage from "../../Img/Index/Hero/Image.png";
import childrenBooksImage from "@/Img/Index/Hero/Image.png";
import newReleasesImage from "@/Img/Index/Hero/Image-1.png";
import fictionImage from "@/Img/Index/Hero/Image-3.png";
import northLiteratureImage from "@/Img/Index/Hero/Image-2.png";

const categories = [
  {
    title: "Children's Books",
    image: childrenBooksImage,
  },
  {
    title: "New Releases",
    image: newReleasesImage,
  },
  {
    title: "Fiction",
    image: fictionImage,
  },
  {
    title: "North & Literature",
    image: northLiteratureImage,
  },
];

const Categories = () => {
  return (
    <div className="container mx-auto p-6">
      <p className="text-1xl font-bold text-center text-[#102249] mb-4">
        Books
      </p>
      <h1 className="text-3xl font-bold text-center mb-4">Categories</h1>
      <p className="text-center text-[#667085] mb-8">
        Here you will find different types of books available at Liberty
        Library.
      </p>
      <div className="grid grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.title}
            className="relative  transform hover:scale-105 transition-transform duration-300  bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full  object-cover"
            />
            <div className="absolute inset-0  flex items-center justify-center">
              <h2 className="text-white text-lg font-semibold">
                {category.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;