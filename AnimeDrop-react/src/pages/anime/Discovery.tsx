import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Form, InputGroup, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";

interface Anime {
  _id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  status: string;
  averageRating: number;
  user: {
    username: string;
    avatar: string;
  };
}

function Discovery() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const availableGenres = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];

  useEffect(() => {
    fetchAnimes();
  }, [searchTerm, selectedGenre]);

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedGenre && selectedGenre !== "All") params.genre = selectedGenre;

      const response = await ApiClient.get("/anime/discovery", { params });
      setAnimes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching animes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">🔍 Discover Anime</h2>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control type="text" placeholder="Search anime..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre === "All" ? "All Genres" : genre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : animes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No anime found</p>
        </div>
      ) : (
        <Row>
          {animes.map((anime) => (
            <Col key={anime._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 hover-shadow">
                <Card.Img variant="top" src={anime.image || "https://via.placeholder.com/300x400?text=No+Image"} style={{ height: "300px", objectFit: "cover" }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <Link to={`/anime/${anime._id}`} className="text-decoration-none">
                      {anime.title}
                    </Link>
                  </Card.Title>

                  <Card.Text className="small text-muted flex-grow-1">
                    {anime.description.substring(0, 100)}
                    {anime.description.length > 100 && "..."}
                  </Card.Text>

                  <div className="mb-2">
                    {anime.genres.slice(0, 3).map((genre, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {anime.averageRating > 0 && (
                    <div className="mb-2">
                      <Badge bg="warning" text="dark">
                        ⭐ {anime.averageRating}
                      </Badge>
                    </div>
                  )}

                  <div className="d-flex align-items-center mt-2">
                    <img src={anime.user.avatar} alt={anime.user.username} width="25" height="25" className="rounded-circle me-2" />
                    <small className="text-muted">by {anime.user.username}</small>
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

export default Discovery;
