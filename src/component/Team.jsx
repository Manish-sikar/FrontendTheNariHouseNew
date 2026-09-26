import OwlCarousel from "react-owl-carousel";
import React, { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faXTwitter,
  faGithub,
  faFacebook,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { GetOurTeamData } from "../services/ourTeamService";
import { baseURL } from "../services/apiService";
const Team = () => {
  const [teamStateData, setTeamStateData] = useState([]);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const iconMapping = {
    "fab fa-facebook": faFacebook,
    "fab fa-twitter": faXTwitter,
    "fab fa-github": faGithub,
    "fab fa-linkedin-in": faLinkedinIn,
  };

  const fetchTeamData = async () => {
    const response = await GetOurTeamData();
    const teamData = response.team_Data;
    setTeamStateData(teamData.filter((member) => member.status === "1"));
  };

  return (
    <>
      {/* <!-- Page Header Start --> */}
      <div class="container-fluid page-header py-5">
        <div class="container text-center py-5">
          <h1 class="display-2 text-white mb-4 animated slideInDown">
            Our Team
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item">
                <Link to="/team">Pages</Link>
              </li>
              <li class="breadcrumb-item" aria-current="page">
                Our Team
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
                <h5 class="text-white mt-1">Total clients who love Diditaladdworldtech</h5>
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

      {/* <!-- Team Start --> */}
      <div className="container-fluid py-5 mb-5 team">
        <div className="container">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 className="text-primary">Our Team</h5>
            <h1>Meet our expert Team</h1>
          </div>

          {/* OwlCarousel for team members */}
          <OwlCarousel
            className="owl-carousel team-carousel wow fadeIn"
            loop
            margin={10}
            nav
            autoplay={true}
            autoplayTimeout={3000}
            smartSpeed={1000}
            responsive={{
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 3 },
            }}
          >
            {teamStateData.map((member, index) => (
              <div key={member._id} className="rounded team-item">
                <div className="team-content">
                  <div className="team-img-icon">
                    <div className="team-img rounded-circle">
                      <img
                        src={`${baseURL}/${member.teamimg}`}
                        className="img-fluid w-100 rounded-circle teampic"
                        alt={member.team_member}
                      />
                    </div>
                    <div className="team-name text-center py-3">
                      <h4>{member.team_member}</h4>
                      <p className="m-0">{member.degination}</p>
                    </div>
                    <div className="team-icon d-flex justify-content-center pb-4">
                      {member.social_icons.map((icon) => (
                        <Link
                          key={icon._id}
                          className="btn btn-square btn-secondary text-white rounded-circle m-1"
                          to={icon.icon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {iconMapping[icon.icon_class] && (
                            <FontAwesomeIcon
                              icon={iconMapping[icon.icon_class]}
                            />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>

      {/* <!-- Team End --> */}

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

export default Team;
