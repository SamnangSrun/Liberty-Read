import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const CardMember = ({
  imageUrl,
  name,
  role,
  facebookLink,
  linkedinLink,
}) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <img
          alt="Profile"
          src={imageUrl}
          className="w-full h-64 sm:h-72 md:h-80 lg:h-72 object-cover rounded-md"
        />

        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-gray-700 mt-1">{role}</p>
          <p className="text-sm text-gray-500 mt-2">
            Student of Royal University of Phnom Penh, Faculty Of Engineering
          </p>

          <div className="mt-4 flex justify-center space-x-6">
            {facebookLink && (
              <a
                href={facebookLink}
                className="text-black hover:text-[#102249]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
            )}

            {linkedinLink && (
              <a
                href={linkedinLink}
                className="text-black hover:text-[#102249]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMember;
