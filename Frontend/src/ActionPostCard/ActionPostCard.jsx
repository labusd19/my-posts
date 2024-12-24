import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import { useNavigate } from "react-router-dom";
import api from "../api/base";

export default function ActionPostCard({
  id,
  title,
  content,
  image,
  onDelete,
}) {
  const navigate = useNavigate();
  const imageUrl = `http://localhost:8080${image}`;

  const deleteHandler = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post successfully deleted!");
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  return (
    <Card className="card" sx={{ maxWidth: 345 }}>
      <CardActionArea className="card-body">
        <CardMedia
          className="card-image"
          component="img"
          height="140"
          image={imageUrl}
          alt={title}
        />
        <CardContent>
          <Typography
            className="card-title"
            gutterBottom
            variant="h5"
            component="div"
          >
            {title}
          </Typography>
          <Typography
            className="card-content"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/posts/${id}`)}
        >
          Details
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/edit-post/${id}`)}
        >
          Edit
        </Button>
        <Button size="small" color="primary" onClick={deleteHandler}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
