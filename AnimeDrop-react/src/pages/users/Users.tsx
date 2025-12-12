import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient.ts";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followers: unknown[];
  following: unknown[];
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await ApiClient.get("/users", { params });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">👥 Users</h2>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No users found</p>
        </div>
      ) : (
        <Row>
          {users.map((user) => (
            <Col key={user._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 text-center hover-shadow">
                <Card.Body>
                  <Link to={`/users/${user._id}`} className="text-decoration-none">
                    <img src={user.avatar} alt={user.username} width="100" height="100" className="rounded-circle mb-3" />
                    <Card.Title>{user.username}</Card.Title>
                  </Link>

                  {user.bio && (
                    <Card.Text className="text-muted small">
                      {user.bio.substring(0, 80)}
                      {user.bio.length > 80 && "..."}
                    </Card.Text>
                  )}

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <div className="fw-bold">{user.followers.length}</div>
                      <small className="text-muted">Followers</small>
                    </div>
                    <div>
                      <div className="fw-bold">{user.following.length}</div>
                      <small className="text-muted">Following</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Users;
