import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {



  return (
    <section style={style.heroBanner}>
      <div style={style.heroContent}>
        <h1 style={style.heroBannerHeading}>Get in Touch With Us!</h1>
        <p style={style.heroBannerParagraph}>Call us now to get the best services at your doorstep.</p>
        <Link to="/login" 
          style={style.callNowBtn} 
          onMouseEnter={(e) => e.target.style = {...style.callNowBtn, ...style.callNowBtnHover}} 
          onMouseLeave={(e) => e.target.style = style.callNowBtn}
          onClick={(e) => e.target.style = style.callNowBtnActive}
        >
          Apply Now
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
  // Inline styles object
const style = {
  heroBanner: {
    backgroundImage: 'url("../img/Untitled design.png")',  // Replace with your own image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',  // Full viewport height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '0 20px',
  },
  heroContent: {
    maxWidth: '600px',
  },
  heroBannerHeading: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  heroBannerParagraph: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  callNowBtn: {
    backgroundColor: '#ff5a5f',  // Attractive button color
    color: 'white',
    padding: '12px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '30px',
    boxShadow: '0 5px 15px rgba(255, 90, 95, 0.3)',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  callNowBtnHover: {
    backgroundColor: '#d44f54',  // Slightly darker shade for hover
    transform: 'scale(1.05)',  // Slight scaling effect
  },
  callNowBtnActive: {
    transform: 'scale(1)',
  },

  // Responsive media query styles
  '@media (max-width: 768px)': {
    heroBanner: {
      backgroundSize: 'contain',  // Adjust for smaller screens
      height: '70vh',  // Adjust height for mobile screens
    },
    heroBannerHeading: {
      fontSize: '2rem',
    },
    heroBannerParagraph: {
      fontSize: '1rem',
    },
  },
};
