import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, Modal } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followers: { _id: string }[];
  following: unknown[];
}

interface Anime {
  _id: string;
  title: string;
  image: string;
  status: string;
  genres: string[];
  averageRating: number;
}

interface UserProfileProps {
  currentUser: {
    id: string;
  };
}

interface ErrorResponse {
  message: string;
}

function UserProfile({ currentUser }: UserProfileProps) {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",
    avatar: "",
  });

  const isOwnProfile = userId === currentUser.id;

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get(`/users/${userId}`);
      const data = response.data.data;
      setUser(data.user);
      setAnimeList(data.animeList || []);
      setIsFollowing(data.user.followers.some((f: { _id: string }) => f._id === currentUser.id));
      setEditForm({
        bio: data.user.bio || "",
        avatar: data.user.avatar || "",
      });
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await ApiClient.post(`/users/${userId}/unfollow`);
      } else {
        await ApiClient.post(`/users/${userId}/follow`);
      }
      fetchUserProfile();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to update follow status");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.put("/users/profile", editForm);
      setShowEditModal(false);
      fetchUserProfile();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error || "User not found"}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center">
              <img src={user.avatar} alt={user.username} width="150" height="150" className="rounded-circle mb-3" />
            </Col>
            <Col md={9}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2>{user.username}</h2>
                  <p className="text-muted">{user.email}</p>
                </div>
                {isOwnProfile ? (
                  <Button variant="primary" onClick={() => setShowEditModal(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant={isFollowing ? "secondary" : "primary"} onClick={handleFollow}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              {user.bio && <p className="mb-3">{user.bio}</p>}

              <div className="d-flex gap-4">
                <div>
                  <strong>{animeList.length}</strong>
                  <div className="text-muted">Anime</div>
                </div>
                <div>
                  <strong>{user.followers.length}</strong>
                  <div className="text-muted">Followers</div>
                </div>
                <div>
                  <strong>{user.following.length}</strong>
                  <div className="text-muted">Following</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4 className="mb-3">{isOwnProfile ? "My" : `${user.username}'s`} Anime List</h4>
      {animeList.length === 0 ? (
        <Card>
          <Card.Body className="text-center text-muted">No anime in the list yet</Card.Body>
        </Card>
      ) : (
        <Row>
          {animeList.map((anime) => (
            <Col key={anime._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 hover-shadow">
                <Card.Img variant="top" src={anime.image || "https://via.placeholder.com/300x400?text=No+Image"} style={{ height: "300px", objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>
                    <Link to={`/anime/${anime._id}`} className="text-decoration-none">
                      {anime.title}
                    </Link>
                  </Card.Title>

                  <div className="mb-2">
                    <Badge bg="primary">{anime.status}</Badge>
                  </div>

                  <div className="mb-2">
                    {anime.genres.slice(0, 2).map((genre, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {anime.averageRating > 0 && (
                    <Badge bg="warning" text="dark">
                      ⭐ {anime.averageRating}
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell us about yourself..." />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control type="url" value={editForm.avatar} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })} placeholder="https://example.com/avatar.jpg" />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default UserProfile;
