import { useState, useEffect } from "react";
import api from "../api/base";
import PostCard from "../PostCard/PostCard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await api.get("/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories([{ id: "all", name: "All" }, ...response.data]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter(
          (post) => String(post.categoryId) === String(selectedCategory)
        )
      );
    }
  }, [selectedCategory, posts]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <h1>Posts</h1>

      <div className="filter-container">
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            image={post.imagePath}
          />
        ))}
      </div>

      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Posts;
