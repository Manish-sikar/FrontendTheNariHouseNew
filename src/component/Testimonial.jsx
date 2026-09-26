import { Link } from "react-router-dom";

const Testimonial = () => {
  return (
    <>
      {/* <!-- Page Header Start --> */}
      <div class="container-fluid page-header py-5">
        <div class="container text-center py-5">
          <h1 class="display-2 text-white mb-4 animated slideInDown">
            Testimonial
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item">
                <Link to="/testimonial">Pages</Link>
              </li>
              <li class="breadcrumb-item" aria-current="page">
                Testimonial
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* <!-- Page Header End --> */}

      {/* <!-- Fact Start --> */}
      <div class="container-fluid bg-secondary py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".1s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">99</h1>
                <h5 class="text-white mt-1">
                  Success in getting happy customer
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".3s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">25</h1>
                <h5 class="text-white mt-1">
                  Thousands of successful business
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".5s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">120</h1>
                <h5 class="text-white mt-1">Total clients who love HighTech</h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".7s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">5</h1>
                <h5 class="text-white mt-1">
                  Stars reviews given by satisfied clients
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fact End --> */}

      {/* <!-- Testimonial Start -->/ */}
      <div class="container-fluid testimonial py-5 mb-5">
        <div class="container">
          <div
            class="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 class="text-primary">Our Testimonial</h5>
            <h1>Our Client Saying!</h1>
          </div>
          <div
            class="owl-carousel testimonial-carousel wow fadeIn"
            data-wow-delay=".5s"
          >
            <div class="testimonial-item border p-4">
              <div class="d-flex align-items-center">
                <div class="">
                  <img src="img/testimonial-1.jpg" alt="" />
                </div>
                <div class="ms-4">
                  <h4 class="text-secondary">Nikita</h4>
                  <p class="m-0 pb-3">
                    Geoffrey Taber Chair in Entrepreneurship and Innovation,
                    University of Toronto, Rotman School of Management
                  </p>
                  <div class="d-flex pe-5">
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                  </div>
                </div>
              </div>
              <div class="border-top mt-4 pt-3">
                <p class="mb-0">
                  “I am really impressed by the quality of services I received
                  from digitaladd world Technology. You were right on schedule,
                  charged reasonable prices, were professional and courteous in
                  dealings, and delivered items well before time. I have got a
                  good e-commerce site for my products. My revenue has increased
                  because of digitaladdworld and I will definitely use your
                  services again.”
                </p>
              </div>
            </div>
            <div class="testimonial-item border p-4">
              <div class=" d-flex align-items-center">
                <div class="">
                  <img src="img/testimonial-2.jpg" alt="" />
                </div>
                <div class="ms-4">
                  <h4 class="text-secondary">Amit Agrawal</h4>
                  <p class="m-0 pb-3">
                    Former Chief Digital, Data, and Analytics Officer at Marsh
                    LLC
                  </p>
                  <div class="d-flex pe-5">
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                  </div>
                </div>
              </div>
              <div class="border-top mt-4 pt-3">
                <p class="mb-0">
                  “We are very happy with digitaladd world Technology; very
                  serious and consistent in their work. Sandeep and his team of
                  programmers have always been there for us all the time. This
                  is a company I can recommend to anyone to perform any work.”
                </p>
              </div>
            </div>
            <div class="testimonial-item border p-4">
              <div class=" d-flex align-items-center">
                <div class="">
                  <img src="img/testimonial-3.jpg" alt="" />
                </div>
                <div class="ms-4">
                  <h4 class="text-secondary">Khushi Sharma</h4>
                  <p class="m-0 pb-3">Former Partner, Goldman Sachs</p>
                  <div class="d-flex pe-5">
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                  </div>
                </div>
              </div>
              <div class="border-top mt-4 pt-3">
                <p class="mb-0">
                  “We have worked with digitaladd world Technology on various
                  projects, and find that they provide quality service and
                  expertise for our programming needs. It is rare to find a
                  service provider with such professional consistency - they are
                  a valued service provider to our business!”
                </p>
              </div>
            </div>
            <div class="testimonial-item border p-4">
              <div class=" d-flex align-items-center">
                <div class="">
                  <img src="img/testimonial-4.jpg" alt="" />
                </div>
                <div class="ms-4">
                  <h4 class="text-secondary">Jim Madden </h4>
                  <p class="m-0 pb-3">
                    Chief Financial Officer, Rockwell Automation
                  </p>
                  <div class="d-flex pe-5">
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                    <i class="fas fa-star me-1 text-primary"></i>
                  </div>
                </div>
              </div>
              <div class="border-top mt-4 pt-3">
                <p class="mb-0">
                  "Outstanding service! The team was incredibly responsive and
                  always available for support. They truly understand what their
                  clients need and deliver with precision."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Testimonial End --> */}

      {/* <!-- Back to Top --> */}
      <button
        className="btn btn-secondary btn-square rounded-circle back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa fa-arrow-up text-white"></i>
      </button>
    </>
  );
};

export default Testimonial;
