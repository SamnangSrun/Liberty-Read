import React from "react";
import white from "../../Img/Logo-w.png";

const FooterComponents = () => {
  return (
    <footer className="bg-[#102249] dark:bg-gray-900 w-full">
      <div className="mx-auto w-full max-w-screen-xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 lg:space-y-12 lg:px-8">
        {/* Logo and Social Icons */}
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-teal-600 dark:text-teal-300 w-28 sm:w-40">
            <img src={white} alt="logo" className="w-full h-auto" />
          </div>

          <ul className="flex justify-center gap-4 sm:gap-6">
            {['Facebook', 'Instagram', 'Twitter', 'GitHub', 'Dribbble'].map((social) => (
              <li key={social}>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:opacity-75 dark:text-gray-200"
                  aria-label={social}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'Facebook' && (
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    )}
                    {social === 'Instagram' && (
                      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.25 2.5a1 1 0 112 0 1 1 0 01-2 0zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/>
                    )}
                    {social === 'Twitter' && (
                      <path d="M8 19c7.732 0 11.96-6.41 11.96-11.96 0-.18 0-.357-.013-.534A8.56 8.56 0 0022 4.8a8.29 8.29 0 01-2.357.646 4.11 4.11 0 001.804-2.27 8.22 8.22 0 01-2.605.997 4.106 4.106 0 00-6.993 3.74 11.65 11.65 0 01-8.46-4.29 4.107 4.107 0 001.27 5.482 4.075 4.075 0 01-1.86-.513v.05a4.108 4.108 0 003.292 4.025 4.095 4.095 0 01-1.853.07 4.109 4.109 0 003.834 2.85A8.233 8.233 0 012 18.128a11.616 11.616 0 006.29 1.84"/>
                    )}
                    {social === 'GitHub' && (
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.07 1.532 1.034 1.532 1.034.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.296 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.7 1.028 1.593 1.028 2.686 0 3.848-2.339 4.695-4.566 4.942.359.31.678.924.678 1.862 0 1.345-.012 2.43-.012 2.76 0 .268.18.58.688.481A10.02 10.02 0 0022 12.02C22 6.484 17.523 2 12 2z"/>
                    )}
                    {social === 'Dribbble' && (
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm6.89 4.61a8.335 8.335 0 013.28 6.71c0 .66-.08 1.3-.22 1.92a16.87 16.87 0 00-7.84-2.13c.48-1.28 1.08-2.5 1.77-3.64a17.26 17.26 0 004.99-2.86zm-1.34-1.03a16.82 16.82 0 01-5.04 2.89c-1.38-2.52-3.06-4.66-4.99-6.15a8.29 8.29 0 0110.03 3.26zm-11.1-1.3a16.92 16.92 0 014.84 6.03 20.45 20.45 0 01-7.47 2.62c-.08-.48-.12-.98-.12-1.49 0-3.55 2.43-6.5 5.26-7.16zm-5.58 9.5a16.97 16.97 0 017.74-2.75c.35.6.68 1.21 1 1.84a20.86 20.86 0 01-8.15 5.27c-.46-1.2-.7-2.5-.59-3.96zm1.92 4.92a18.02 18.02 0 007.98-5.3c1.6 3.21 2.48 6.72 2.48 10.29 0 .22-.01.44-.01.66-4.97-.04-9.26-3.29-10.45-7.65zm13.36 4.67a16.7 16.7 0 01-2.27-7.34 20.9 20.9 0 018.03 2.17c-.87 3.84-3.79 6.8-7.76 7.17z"/>
                    )}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-6 sm:grid-cols-2 sm:gap-8 sm:pt-8 lg:grid-cols-4 lg:pt-12 dark:border-gray-800">
          {/* Address */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <p className="font-medium text-sm sm:text-base text-gray-400 dark:text-white">
              Faculty of Engineering, STEM Building, Royal University of Phnom Penh (Campus 1), Russian Federation Blvd (110), Phnom Penh.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <p className="font-medium text-sm sm:text-base text-gray-400 dark:text-white text-center sm:text-left">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-center sm:text-left">
              {['About', 'Meet the Team', 'Accounts Review'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white transition hover:opacity-75 dark:text-gray-200 text-xs sm:text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <p className="font-medium text-sm sm:text-base text-gray-400 dark:text-white text-center sm:text-left">Helpful Links</p>
            <ul className="mt-3 space-y-2 text-sm text-center sm:text-left">
              {['Contact', 'FAQs', 'Live Chat'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white transition hover:opacity-75 dark:text-gray-200 text-xs sm:text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <p className="font-medium text-sm sm:text-base text-gray-400 dark:text-white text-center sm:text-left">Social</p>
            <ul className="mt-3 space-y-2 text-sm text-center sm:text-left">
              {['Facebook', 'Youtube', 'GitHub', 'Email'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white transition hover:opacity-75 dark:text-gray-200 text-xs sm:text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-6 sm:mt-8">
          © {new Date().getFullYear()} Copyright Liberty Reads
        </p>
      </div>
    </footer>
  );
};

export default FooterComponents;
