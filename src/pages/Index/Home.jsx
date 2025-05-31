import HeroHome from "@/Components/Index/HeroHome";
import ServiCeCard from "@/Components/Index/ServiceCard.jsx";
import Categories from "@/Components/Index/Categories.jsx";
import Anime from "@/Components/Index/Anime-Films/Anime.jsx";
import Khmer from "@/Components/Index/KhmerLegend/khmer.jsx";
import Feedbacks from "@/Components/Index/Feedback.jsx";
import Questions from "@/Components/Index/Questions.jsx";

const Home = () => {
  return (
    <div>
      <HeroHome />
      <ServiCeCard />
      <Anime />
      <Categories />
      <Khmer />
      <Feedbacks />
      <Questions />
    </div>
  );
};

export default Home;