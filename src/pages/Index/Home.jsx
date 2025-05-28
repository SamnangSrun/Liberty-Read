import HeroHome from "@/components/index/HeroHome";
import ServiceCard from "@/components/index/ServiceCard.jsx";
import Categories from "@/components/index/Categories.jsx";
import Anime from "@/components/index/Anime-Films/Anime.jsx";
import Khmer from "@/components/index/KhmerLegend/khmer.jsx";
import Feedbacks from "@/components/index/Feedback.jsx";
import Questions from "@/components/index/Questions.jsx";

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