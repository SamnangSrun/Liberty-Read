import Hero from "@/Components/Index/HeroApp";
import ServiceCard from "@/Components/Index/ServiceCard.jsx";
import Categories from "@/Components/Index/Categories.jsx";
import Anime from "@/Components/Index/Anime-Films/Anime.jsx";
import Khmer from "@/Components/Index/KhmerLegend/khmer.jsx";
import Feedbacks from "@/Components/Index/Feedback.jsx";
import Questions from "@/Components/Index/Questions.jsx";

function App() {
  return (
    <>
      <Hero />
      <ServiceCard />
      <Anime />
      <Categories />
      <Khmer />
      <Feedbacks />
      <Questions />
    </>
  );
}

export default App;