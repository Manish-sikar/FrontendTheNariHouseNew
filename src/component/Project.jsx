import { Link } from "react-router-dom";
import { GetProjectData } from "../services/projectService";
import { useEffect, useState } from "react";

const Project = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [showMore, setShowMore] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await GetProjectData(); // Fetch project data from your API
    const projectData = response.projects_Data;
    setProjectsData(projectData.filter((project) => project.status === "1"));
    setShowMore(new Array(projectData.length).fill(false)); // Initialize showMore array
  };

  const toggleDetails = (index) => {
    setShowMore((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index]; // Toggle the specific index
      return newState;
    });
  };

  return (
    <>
   
     
    

     
      

        <div class="container-fluid services py-5 mb-5">
        <div class="container">
          <div
            class="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 class="text-primary">Our Project</h5>
            <h1>Our Recently Completed And In Process Projects</h1>
          </div>
          <div class="row g-5 services-inner">
          {projectsData.map((project, index) => (
            <div class="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
              <div class="services-item bg-light">
                <div class="p-4 text-center services-content">
                  <div class="services-content-icon">
                    <img
                      src={project.projectimg}
                      alt={project.project_title}
                      class="mb-4"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "contain",
                      }}
                    ></img>
                     <h4 className="mb-3">{project.project_title}</h4>
                     <p className="mb-4">{project.project_desc}</p>
                      {/* Show More Toggle */}
                      {showMore[index] && (
                        <p className="mb-4">{project.more_project_desc}</p>
                      )}
                    <Link
                      to="/project"
                      class="btn btn-secondary text-white px-5 py-3 rounded-pill"
                      onClick={() => toggleDetails(index)}
                      >
                        {showMore[index] ? "Show Less" : "Read More"}
                      </Link>
                  </div>
                </div>
              </div>
            </div>
           

          ))}
          </div>
        </div>
      </div>  

     

      {/* <!-- Project End -->/ */}

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

export default Project;
