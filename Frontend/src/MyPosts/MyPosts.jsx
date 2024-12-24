import { useState, useEffect } from "react";
import api from "../api/base";
import ActionPostCard from "../ActionPostCard/ActionPostCard";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await api.get("/my-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h1>My Posts</h1>
      <div className="posts-container">
        {posts.map((post) => (
          <ActionPostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            image={post.imagePath}
            onDelete={handlePostDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
