import React from "react";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-primary text-white ">
        <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                About
                <span className="block text-[#F5B041] capitalize">
                  Vice queen industries
                </span>
              </h1>
              <p className="text-lg mb-8">
                Vice Queen Industries (KE) Ltd is a forward-thinking company
                dedicated to enhancing the lives of individuals and households
                through the production and distribution of high-quality
                products. Based in Kenya, Tanzania, and Uganda we have built a
                reputation for reliability, innovation, and a steadfast
                commitment to ethical and sustainable business practices.
              </p>
              <div className="bg-[#F5B041] text-[#5D4E8C] p-6 rounded-lg inline-block">
                <p className="text-xl font-semibold">
                  Founded on the principles of quality, integrity, and
                  customer-centricity
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#5D4E8C] mb-4">
            CEO
            <span className="block text-[#F5B041]">Message</span>
          </h2>
          <div className="text-gray-700 text-lg leading-relaxed mb-8 flex">
            <RiDoubleQuotesL />
            <span>
              At Vice Queen Industries (KE) Ltd, we are committed to setting the
              benchmark for quality, innovation, and sustainability. Our
              relentless pursuit of quality excellence ensures that we deliver
              products that exceed international standards. Our dedication to
              innovation and a customer-centric approach drives us to
              continuously improve and adapt to your needs. We believe in
              ethical conduct, community engagement, and partnerships that make
              a positive impact on the world. As we move forward, our focus
              remains on delivering quality, innovation, and responsibility in
              every product we offer. We are dedicated to improving your life
              and contributing positively to the world.
            </span>
            <RiDoubleQuotesR />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#5D4E8C]">
                ISABELLE BOCKLE
              </h3>
              <p className="text-[#F5B041]">CEO, VICE QUEEN INDUSTRIES</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#5D4E8C] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">
              Mission
              <span className="block text-[#F5B041]">& Vision</span>
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-[#F5B041] mb-4">
                Mission
              </h3>
              <p className="text-lg">
                At Vice Queen Industries (KE) Ltd, our mission is to transform
                the product landscape in Kenya and beyond. We are committed to
                delivering exceptional value and quality to our customers while
                upholding the highest standards of integrity, sustainability,
                and innovation.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#F5B041] mb-4">Vision</h3>
              <ul className="space-y-6">
                <li>
                  <h4 className="font-bold text-[#F5B041] mb-2">
                    Lead in Quality
                  </h4>
                  <p>
                    We envision our products setting the benchmark for quality
                    in the industry, meeting and surpassing international
                    standards.
                  </p>
                </li>
                <li>
                  <h4 className="font-bold text-[#F5B041] mb-2">
                    Uphold Integrity
                  </h4>
                  <p>
                    We strive to be recognized as a company that conducts its
                    business with unwavering integrity, honesty, and
                    transparency, ensuring the trust of our stakeholders.
                  </p>
                </li>
                <li>
                  <h4 className="font-bold text-[#F5B041] mb-2">
                    Pioneer Innovation
                  </h4>
                  <p>
                    We aim to lead the market in innovation, introducing
                    groundbreaking products that enhance the lives of our
                    customers.
                  </p>
                </li>
                <li>
                  <h4 className="font-bold text-[#F5B041] mb-2">
                    Embrace Sustainability
                  </h4>
                  <p>
                    We see ourselves as pioneers in sustainable business
                    practices, taking active steps to reduce our ecological
                    footprint and supporting the local community.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
