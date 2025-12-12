import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function Home() {
  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to AnimeDrop 🎌</h1>
        <p className="lead text-muted">Your personal anime catalog and tracker with social features</p>
      </div>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Link to="/my-list" className="text-decoration-none">
            <Card className="h-100 hover-shadow">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>📝</span>
                </div>
                <Card.Title>My List</Card.Title>
                <Card.Text className="text-muted">Manage your anime collection</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={6} lg={3}>
          <Link to="/discovery" className="text-decoration-none">
            <Card className="h-100 hover-shadow">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>🔍</span>
                </div>
                <Card.Title>Discovery</Card.Title>
                <Card.Text className="text-muted">Find new anime to watch</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={6} lg={3}>
          <Link to="/users" className="text-decoration-none">
            <Card className="h-100 hover-shadow">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>👥</span>
                </div>
                <Card.Title>Users</Card.Title>
                <Card.Text className="text-muted">Connect with other fans</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={6} lg={3}>
          <Link to="/notifications" className="text-decoration-none">
            <Card className="h-100 hover-shadow">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>🔔</span>
                </div>
                <Card.Title>Notifications</Card.Title>
                <Card.Text className="text-muted">Stay updated</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <Card className="mt-5 bg-light">
        <Card.Body>
          <h3 className="mb-3">Features</h3>
          <Row>
            <Col md={6}>
              <ul>
                <li>✅ Create and manage your personal anime list</li>
                <li>✅ Rate and review anime you've watched</li>
                <li>✅ Track your watching progress</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul>
                <li>✅ Discover new anime with genre filtering</li>
                <li>✅ Follow other users and see their lists</li>
                <li>✅ Get notifications for updates</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Home;
