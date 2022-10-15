import React from 'react';
import './contact.css';

// Created a contact page where the customer can send the store a message. The email address is not real and is used just for the purpose of this project.
const Contact = () => {
  return (
    <div className="container">
      <div className="contact-heading">
        <h1>Contact Us</h1>
      </div>
      <div>
        <form action="mailto:phantom@gmail.com" method="post" type="text/plain">
          <label className="label" name="Name">
            Name:
          </label>
          <br />
          <input
            required
            type="text"
            name="Name"
            className="input"
            placeholder="Type your name and surname"
          />
          <br />
          <label className="label" name="Email">
            Email:
          </label>
          <br />
          <input
            required
            type="text"
            name="Email"
            className="input"
            placeholder="Type your email address"
          />
          <br />
          <label className="label" name="Contact">
            Phone Number:
          </label>
          <br />
          <input
            required
            type="text"
            name="Contact"
            className="input"
            placeholder="Type your phone number"
          />
          <br />
          <label className="label" name="Message">
            Message:
          </label>
          <br />
          <textarea
            required
            type="text"
            name="Message"
            className="message"
            placeholder="Type your message"
          ></textarea>
          <br />
          <div>
            <button type="submit" value="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* We export the 'Contact' component in order to display this code in App.js. */
export default Contact;
