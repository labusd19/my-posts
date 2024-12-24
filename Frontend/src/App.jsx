import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import Posts from "./Posts/Posts";
import Details from "./Details/Details";
import Login from "./Login/Login";
import MyPosts from "./MyPosts/MyPosts";
import Signup from "./Signup/Signup";
import AddPost from "./AddPost/AddPost";
import EditPost from "./EditPost/EditPost";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<Details />} />
        <Route path="/my-posts" element={<MyPosts />} />

        <Route path="/add-post" element={<AddPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
