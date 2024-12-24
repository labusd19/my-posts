import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import api from "../api/base";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = token ? jwtDecode(token).userId : null;
  const userRole = jwtDecode(token).role;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Proverite vlasništvo nad postom
        if (userRole !== 1 && data.userId !== userId) {
          setError("You do not have permission to edit this post.");
          setLoading(false);
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setCurrentImage(data.imagePath);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post data", err);
        setError("Failed to fetch post data");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token, userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleEditPost = async () => {
    const postData = new FormData();

    if (title) postData.append("title", title);
    if (content) postData.append("content", content);
    if (image) postData.append("image", image);

    try {
      const response = await api.put(`/edit-post/${id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from server:", response.data);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Failed to edit post", error);
      setError("Failed to edit post. Please try again later.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return (
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5">Edit Post</Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {currentImage && (
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Current Image:
            </Typography>
            <Box
              component="img"
              src={`http://localhost:8080${currentImage}`}
              alt="Current post image"
              sx={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: "4px",
                marginTop: 1,
              }}
            />
          </Box>
        )}

        <Button variant="outlined" component="label" fullWidth margin="normal">
          Upload New Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {image && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 1 }}
          >
            {image.name}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleEditPost}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default EditPost;
