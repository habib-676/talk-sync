import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram, FaUsers, FaXTwitter } from "react-icons/fa6";

const ContactForm = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

      {/* Contact Form */}
      <form className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <label className="form-control flex-1">
            <div className="label">
              <span className="label-text">Your Name</span>
            </div>
            <input
              type="text"
              placeholder="e.g., Maria Garcia"
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control flex-1">
            <div className="label">
              <span className="label-text">Email Address</span>
            </div>
            <input
              type="email"
              placeholder="e.g., name@example.com"
              className="input input-bordered w-full"
              required
            />
          </label>
        </div>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">What can we help you with?</span>
          </div>
          <br />
          <select className="select select-bordered" required>
            <option disabled selected>
              Select a category
            </option>
            <option>General Question</option>
            <option>Bug Report</option>
            <option>Feature Idea</option>
            <option>Partnership Inquiry</option>
            <option>Press</option>
          </select>
        </label>

        {/* Contextual Helper Text for Bugs */}
        <div className="bg-info/10 border-l-4 border-info p-4 rounded-r-box animate-fadeIn mt-6">
          <div className="flex gap-2">
            <BiError
              size={25}
              className="bg-info text-accent-content p-1 rounded"
            />
            <span className="text-sm">
              <strong>Reporting a bug?</strong> Please tell us what device and
              browser you were using. A screenshot helps a lot!
            </span>
          </div>
        </div>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Your Message</span>
          </div>
          <br />
          <textarea
            className="textarea textarea-bordered h-32 w-full"
            placeholder="How can we help you today?"
            required
          ></textarea>
        </label>

        <button
          type="submit"
          className="btn btn-primary btn-block rounded-full shadow-lg mt-6"
        >
          Send Message
        </button>
      </form>

      {/* Direct Contact Info */}
      <div className="mt-12 pt-8 border-t border-base-300 ">
        <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <AiOutlineMail className="text-accent text-xl" />
            <a href="mailto:hello@talksync.com" className="link link-hover">
              hello@talksync.com
            </a>
          </div>
          {/* social links to contact */}
          <div>
            <p className="flex items-center gap-3 mb-2">
              <FaUsers className="text-accent text-xl" />
              Follow us for updates & language tips!
            </p>
            <div className="flex gap-4">
              <a className="btn btn-circle btn-sm btn-ghost">
                {/* Twitter/X Icon */}
                <FaXTwitter className="text-xl" />
              </a>
              <a className="btn btn-circle btn-sm btn-ghost">
                {/* Instagram Icon */}
                <FaInstagram className="text-xl" />
              </a>
              <a className="btn btn-circle btn-sm btn-ghost">
                {/* LinkedIn Icon */}
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
