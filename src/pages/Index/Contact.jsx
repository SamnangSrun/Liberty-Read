import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-10 px-4 sm:px-6 md:px-16 bg-white shadow-lg pb-10">
          <h2 className="text-center text-2xl sm:text-3xl text-[#102249] font-semibold mb-4">
            Contact Us
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 px-2 sm:px-0">
            We'd love to hear from you! Fill out the form below or reach out to
            us via email or phone.
          </p>

          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/2 p-4 sm:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-[#102249]">
                Contact Information
              </h3>
              <p className="mb-4">Say something to start a live chat!</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faPhone} className="text-[#102249]" />
                  </span>
                  <p className="text-sm sm:text-base">+1012 3456 789</p>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#102249]" />
                  </span>
                  <p className="text-sm sm:text-base">Libertyreads@gmail.com</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[#102249]" />
                  </span>
                  <p className="font-bold text-xs sm:text-sm">
                    Faculty of Engineering, STEM Building, Royal University of Phnom Penh,
                    Russian Federation Blvd (110), Phnom Penh.
                  </p>
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-1/2 p-4 sm:p-6 rounded-lg">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium text-sm">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full mt-2 px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full mt-2 px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium text-sm">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full mt-2 px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring focus:outline-none"
                    placeholder="Write your message..."
                  ></textarea>
                </div>
                <div className="flex justify-end items-end">
                  <button
                    type="submit"
                    className="w-full sm:w-[200px] shadow text-[#102249] py-2 rounded-lg hover:bg-[#102249] hover:text-white transition text-sm sm:text-base"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
