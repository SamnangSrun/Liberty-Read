import React from "react";
import Book from "../../Img/Index/Hero/aboutBook.png";
import about from "../../Img/Index/Hero/about.png";
import about_1 from "../../Img/Index/Hero/about-1.png";
import about_2 from "../../Img/Index/Hero/about-2.png";
import about_3 from "../../Img/Index/Hero/about-3.png";
import AllCardMember from "../../Components/Index/Member/All";

const AboutUs = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <header className="bg-white">
        <section className="relative">
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:py-16 lg:flex lg:items-center lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              <div className="lg:pr-12">
                <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                  About Liberty Library
                </h1>
                <p className="mt-4 text-gray-600">
                  Liberty Library is a unique platform dedicated to making
                  knowledge and literature accessible to everyone. By offering a
                  vast collection of free books across various genres, we aim to
                  inspire a love for reading and lifelong learning.
                </p>
              </div>

              <div className="relative lg:pl-12">
                <img
                  src={Book}
                  className="w-48 max-w-md mx-auto rounded-lg transform hover:scale-105 transition-transform duration-300"
                  alt="Liberty Library Books"
                />
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider text-[#444444] uppercase">
              About us
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#102249] sm:text-4xl">
              Mission & Vision
            </h2>
            <p className="mt-3 text-xl text-[#667085] max-w-3xl mx-auto">
              For Liberty Library, here are suggestions for the mission and vision statements:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1">
              <img
                src={about}
                className="w-full rounded-lg "
                alt="Mission and Vision"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Mission
              </h3>
              <p className="mt-4 text-gray-600">
                "At Liberty Library, our mission is to democratize access to literature and knowledge by offering free books to everyone, everywhere. We are dedicated to fostering an inclusive community of readers, providing a diverse range of titles that empower, educate, and entertain."
              </p>
              <h3 className="mt-8 text-2xl font-bold text-gray-900 sm:text-3xl">
                Vision
              </h3>
              <p className="mt-4 text-gray-600">
                "Our vision is to become the leading online bookshop where knowledge knows no boundaries. We aspire to build a world where everyone, regardless of background or circumstance, can freely access the resources they need to grow, learn, and thrive."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {[
        {
          title: "Give Life to Reading",
          text: "Reading opens doors to endless worlds, knowledge, and possibilities. Each page turned breathes life into stories, ideas, and wisdom that enrich our lives. Dive into a book and let it take you on a journey beyond boundaries, where imagination and understanding thrive.",
          image: about_1,
          reverse: false
        },
        {
          title: "Seed of Knowledge",
          text: "Plant the seed of knowledge and watch it grow! With every book, we cultivate curiosity, wisdom, and understanding. Books nurture minds, helping ideas take root and flourish. They bridge the past and future, connecting us to insights that shape our journey.",
          image: about_2,
          reverse: true
        },
        {
          title: "Best for Bookworms",
          text: "For true bookworms, each book is a new adventure waiting to unfold. The joy of reading lies in every page turned, every new world explored, and every bit of knowledge gained. Dive into a book and let it be your guide through endless realms of imagination and insight.",
          image: about_3,
          reverse: false
        }
      ].map((section, index) => (
        <section key={index} className={`py-12 ${index % 2 === 0 ? '' : 'bg-white'}`}>
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center ${section.reverse ? 'md:flex-row-reverse' : ''}`}>
              <div className={`${section.reverse ? 'order-2' : 'order-1'}`}>
                <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-4 text-gray-600">
                  {section.text}
                </p>
              </div>
              <div className={`${section.reverse ? 'order-1' : 'order-2'}`}>
                <img
                  src={section.image}
                  className="w-full rounded-lg "
                  alt={section.title}
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Advisor Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider text-[#444444] uppercase">
              Our Advisor
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#102249] sm:text-4xl">
              Advisor
            </h2>
            <p className="mt-3 text-xl text-[#667085] max-w-3xl mx-auto">
              Advisor of Liberty Library, is committed to supporting our mission to provide free access to books and knowledge for everyone.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8  p-6 rounded-lg shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Ms. Sambocheyear"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-medium text-gray-900">Ms. Sambocheyear</h3>
              <p className="mt-2 text-gray-600">
                Mrs. Soy Sambocheyear is a lecturer and researcher in Department of IT Engineering at Royal University of Phnom Penh since 2017. She received her MA in Computer Engineering from Daejeon University at South Korea in 2014. Her research interest include MIS and Software testing.
              </p>
              <blockquote className="mt-4 italic text-gray-700">
                "At Liberty Library, our mission is to make literature and knowledge accessible to everyone, everywhere, by offering free books."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-12 ">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider text-[#444444] uppercase">
              Founder
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#102249] sm:text-4xl">
              Liberty Reads Founder
            </h2>
            <p className="mt-3 text-xl text-[#667085] max-w-3xl mx-auto">
              These are founder of Liberty Library.
            </p>
          </div>
          
          <AllCardMember />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;