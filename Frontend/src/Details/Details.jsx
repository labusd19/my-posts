import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/base";

export default function Details() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.log("Failed to fetch post! ", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <Container
        maxWidth="md"
        sx={{
          paddingTop: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const imageUrl = `http://localhost:8080${post.imagePath}`;
  console.log(imageUrl);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="100%"
          image={imageUrl}
          alt={post.title}
        />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {post.content}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              User ID: {post.userId}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
