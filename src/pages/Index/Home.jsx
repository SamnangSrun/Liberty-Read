import HeroHome from "@/components/Index/HeroHome";
import ServiceCard from "@/components/Index/ServiceCard.jsx";
import Categories from "@/components/Index/Categories.jsx";
import Anime from "@/components/Index/Anime-Films/Anime.jsx";
import Khmer from "@/components/Index/KhmerLegend/khmer.jsx";
import Feedbacks from "@/components/Index/Feedback.jsx";
import Questions from "@/components/Index/Questions.jsx";

const Home = () => {
  return (
    <div>
      <HeroHome />
      <ServiceCard />
      <Anime />
      <Categories />
      <Khmer />
      <Feedbacks />
      <Questions />
    </div>
  );
};

export default Home;