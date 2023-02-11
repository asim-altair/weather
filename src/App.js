import { useEffect, useState } from "react";
import "./app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [data, setData] = useState();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          console.log(longitude, latitude);
          const fetchData = async () => {
            try {
              await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=881797d47c82892bfbf7fbce6df7d0fb&units=metric`
              )
                .then((res) => {
                  if (res.ok) {
                    return res.json();
                  } else {
                    console.log("fetching faild");
                  }
                })
                .then((result) => {
                  setData(result);
                });
            } catch (error) {
              console.log(error);
            }
          };
          fetchData();
        });
      }
    }
    getLocation();
    //
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        {data ? (
          <div>
            <p className="time">{time ? time.toString() : ""}</p>
            <h3 className="city">{data.name}</h3>
            <div className="font">
              {data.clouds ? (
                data.clouds.all > 60 ? (
                  <FontAwesomeIcon icon={faCloudRain} />
                ) : data.clouds && data.clouds.all > 30 ? (
                  <FontAwesomeIcon icon={faCloudSun} />
                ) : (
                  <FontAwesomeIcon icon={faSun} />
                )
              ) : (
                "Loading.."
              )}
            </div>
            <div className="temp">
              {data.main && data.main.temp.toString()}&deg;
            </div>
          </div>
        ) : (
          "Loading.."
        )}
      </div>
    </div>
  );
}

export default App;
