import React from "react";

const About = () => {
  return (
    <div className="about-finance-container">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-center p-3">About Finance</h1>
        <p className="text-muted">
          Learn more about our finance services and goals.
        </p>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="row justify-content-center">
          {/* Small Box 1 */}
          <div className="col-12 col-md-4 mb-4">
            <section className="small-box text-center p-3">
              <h2>Our Mission</h2>
              <p>
                Our mission is to empower individuals and businesses with the
                financial tools they need to succeed. From investments to loans,
                we provide comprehensive financial solutions tailored to your
                unique needs.
              </p>
            </section>
          </div>

          {/* Small Box 2 */}
          <div className="col-12 col-md-4 mb-4">
            <section className="small-box text-center p-3">
              <h2>Why Choose Us?</h2>
              <ul className="text-start">
                <li>Trusted by thousands of customers worldwide</li>
                <li>Transparent and ethical financial practices</li>
                <li>Expert advisors with years of experience</li>
              </ul>
            </section>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <section className="small-box text-center p-3">
              <h2>Why Choose Us?</h2>
              <ul className="text-start">
                <li>Trusted by thousands of customers worldwide</li>
                <li>Transparent and ethical financial practices</li>
                <li>Expert advisors with years of experience</li>
              </ul>
            </section>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <section className="small-box text-center p-3">
              <h2>Why Choose Us?</h2>
              <ul className="text-start">
                <li>Trusted by thousands of customers worldwide</li>
                <li>Transparent and ethical financial practices</li>
                <li>Expert advisors with years of experience</li>
              </ul>
            </section>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <section className="small-box text-center p-3">
              <h2>Why Choose Us?</h2>
              <ul className="text-start">
                <li>Trusted by thousands of customers worldwide</li>
                <li>Transparent and ethical financial practices</li>
                <li>Expert advisors with years of experience</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
