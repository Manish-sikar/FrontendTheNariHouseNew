import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { GetOurTeamData } from "../../services/ourTeamService";

const SupportPage = () => {
  const [teamData, setTeamData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetOurTeamData();
      if (response?.team_Data) {
        setTeamData(response.team_Data);
        setSelectedTab(response.team_Data[0]?.degination); // default tab
      }
    };
    fetchData();
  }, []);

  const uniqueDesignations = [...new Set(teamData.map((t) => t.degination))];
  const filteredTeam = teamData.filter((t) => t.degination === selectedTab);

  return (
    <Container className="mt-5">
      <h2>Support Team</h2>

      {/* Tabs by Designation */}
      <div className="d-flex mb-4 flex-wrap">
        {uniqueDesignations.map((designation) => (
          <Button
            key={designation}
            variant={selectedTab === designation ? "primary" : "secondary"}
            onClick={() => setSelectedTab(designation)}
            className="me-2 mb-2"
          >
            {designation.replace("_", " ").toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Team Members Table */}
      {filteredTeam.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact / Social</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeam.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={member.teamimg}
                    alt="team"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>{member.team_member}</td>
                <td>{member.degination}</td>
                <td>
                  {member.social_icons.map((icon, idx) => (
                    <a
                      key={idx}
                      href={icon.icon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="me-3 d-inline-block"
                    >
                      <i className={icon.icon_class}></i> {icon.icon_name}
                    </a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No team members found for this designation.</p>
      )}
    </Container>
  );
};

export default SupportPage;
