import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import api from "../api/base";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const userId = token ? jwtDecode(token).userId : null;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddPost = async () => {
    if (!title || !content || !image) {
      setError("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("userId", userId);

    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post added!", response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Failed to add post");
    }
  };

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
        <Typography variant="h5">Add Post</Typography>
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
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
        <Button variant="outlined" component="label" fullWidth margin="normal">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {image && (
          <Typography variant="body2" color="textSecondary">
            {image.name}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleAddPost}
        >
          Add Post
        </Button>
      </Box>
    </Container>
  );
};

export default AddPost;
