import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";

function App() {
  // Set the initial date to today's date

  const today = new Date();

  const todayDate =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    (today.getDate() - 1);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [date, setDate] = useState(todayDate);

  useEffect(() => {
    // NASA API AND KEY
    const API_KEY = process.env.REACT_APP_API_KEY;
    const NASA_API = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(NASA_API);
        const json = await response.json();
        setLoading(false);

        setData(json);
      } catch (error) {
        console.log(error, "ERROR");
      }
    };

    fetchData();
  }, [date]);

  // Return while fetching date

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100 flex-column">
        <h3 className="text-center mt-3">
          Fetching Data from <span className="text-primary"> NASA</span>, please
          wait...
        </h3>
        <img src={"./alien-logo.png"} alt="alien logo" width="100px" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand href="#home" className="text-white">
            <img src={"./alien-logo.png"} alt="alien logo" width="40px" /> Alien
            Finder by <span className="text-primary">ALGO</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {data && data.photos.length === 0 ? (
        <>
          <h1 className="text-center m-5">
            No Data, try changing the date or the rover
          </h1>
          <div className="wrapper w-100 d-flex flex-column justify-content-center align-items-center">
            <Form.Label>Enter Date:</Form.Label>
            <Form.Control
              type="date"
              className="w-50"
              defa
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center my-4">
            <span className="text-primary">NASA</span> Curiosity Photos
          </h1>
          <div className="wrapper w-100 d-flex flex-column justify-content-center align-items-center">
            <Form.Label>Enter Date:</Form.Label>
            <Form.Control
              type="date"
              className="w-50"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="row mx-3">
            {data &&
              data.photos.map((i) => {
                return (
                  <div key={i.id} className="col-md-4 my-3">
                    {
                      <Card>
                        <a href={i.img_src}>
                          <Card.Img variant="top" src={i.img_src} />
                        </a>
                        <Card.Body>
                          <Card.Title>Rover: {i.rover.name}</Card.Title>
                          <Card.Text>
                            <p className="mb-0">Martian Time: {i.sol} </p>
                            <p className="mb-0">Earth Time: {i.earth_date} </p>
                            <p className="mb-0">Camera: {i.camera.full_name}</p>
                            <p className="mb-0">
                              Status:
                              <span
                                className={
                                  i.rover.status === "active"
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {i.rover.status}
                              </span>
                            </p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    }
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
