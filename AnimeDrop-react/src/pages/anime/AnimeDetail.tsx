import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Form, Button, Alert, Spinner, ListGroup } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

interface Anime {
  _id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  status: string;
  episodes: number;
  episodesWatched: number;
  averageRating: number;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  reviews: Review[];
}

interface AnimeDetailProps {
  user: {
    id: string;
    username: string;
  };
}

interface ErrorResponse {
  message: string;
}

function AnimeDetail({ user }: AnimeDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnime();
  }, [id]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get(`/anime/${id}`);
      setAnime(response.data.data);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch anime");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await ApiClient.post(`/anime/${id}/review`, reviewForm);
      setReviewForm({ rating: 5, review: "" });
      fetchAnime();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!anime) {
    return (
      <Container className="my-4">
        <Alert variant="danger">Anime not found</Alert>
      </Container>
    );
  }

  const userHasReviewed = anime.reviews.some((review) => review.user._id === user.id);

  return (
    <Container className="my-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={anime.image || "https://via.placeholder.com/300x400?text=No+Image"} style={{ height: "500px", objectFit: "cover" }} />
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h2>{anime.title}</h2>

              <div className="mb-3">
                {anime.genres.map((genre, idx) => (
                  <Badge key={idx} bg="secondary" className="me-2">
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="mb-3">
                <Badge bg="primary">{anime.status}</Badge>
                {anime.averageRating > 0 && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    ⭐ {anime.averageRating}
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                <strong>Episodes:</strong> {anime.episodesWatched}/{anime.episodes || "?"}
              </div>

              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-2">{anime.description}</p>
              </div>

              <div className="d-flex align-items-center">
                <img src={anime.user.avatar} alt={anime.user.username} width="40" height="40" className="rounded-circle me-2" />
                <div>
                  <small className="text-muted">Added by</small>
                  <div>
                    <Link to={`/users/${anime.user._id}`} className="text-decoration-none">
                      {anime.user.username}
                    </Link>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Reviews ({anime.reviews.length})</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              {!userHasReviewed ? (
                <Form onSubmit={handleSubmitReview} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Your Rating</Form.Label>
                    <Form.Select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} - {"⭐".repeat(Math.ceil(num / 2))}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control as="textarea" rows={4} value={reviewForm.review} onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })} placeholder="Write your review..." required />
                  </Form.Group>

                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </Form>
              ) : (
                <Alert variant="info">You have already reviewed this anime</Alert>
              )}

              {anime.reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                <ListGroup>
                  {anime.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <div className="d-flex align-items-start mb-2">
                        <img src={review.user.avatar} alt={review.user.username} width="40" height="40" className="rounded-circle me-2" />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <Link to={`/users/${review.user._id}`} className="text-decoration-none fw-bold">
                              {review.user.username}
                            </Link>
                            <Badge bg="warning" text="dark">
                              ⭐ {review.rating}
                            </Badge>
                          </div>
                          <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <p className="mb-0">{review.review}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AnimeDetail;
