import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function Home({ type }) {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const payload = {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      };
      // const base_url="http://localhost:8000/api/videos"
      const response = await axios.get(`videos/${type}`, payload);
      console.log("Response :", response);
      setVideos(response.data.data);
    };
    fetchVideos();
  }, [type]);
  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
}

export default Home;
