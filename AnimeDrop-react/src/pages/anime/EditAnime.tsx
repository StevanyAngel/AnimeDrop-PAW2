import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Badge, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface FormData {
  title: string;
  description: string;
  image: string;
  genres: string[];
  status: string;
  episodes: number;
  episodesWatched: number;
}

interface ErrorResponse {
  message: string;
}

function EditAnime() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    image: "",
    genres: [],
    status: "Planning",
    episodes: 0,
    episodesWatched: 0,
  });
  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const availableGenres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];

  useEffect(() => {
    fetchAnime();
  }, [id]);

  const fetchAnime = async () => {
    try {
      const response = await ApiClient.get(`/anime/${id}`);
      const anime = response.data.data;
      setForm({
        title: anime.title,
        description: anime.description,
        image: anime.image,
        genres: anime.genres,
        status: anime.status,
        episodes: anime.episodes,
        episodesWatched: anime.episodesWatched,
      });
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch anime");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "episodes" || name === "episodesWatched" ? parseInt(value) || 0 : value,
    });
  };

  const addGenre = (genre: string) => {
    if (!form.genres.includes(genre)) {
      setForm({ ...form, genres: [...form.genres, genre] });
    }
    setGenreInput("");
  };

  const removeGenre = (genre: string) => {
    setForm({ ...form, genres: form.genres.filter((g) => g !== genre) });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await ApiClient.put(`/anime/${id}`, form);

      if (response.status === 200) {
        navigate("/my-list");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to update anime");
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

  return (
    <Container className="my-4">
      <Card>
        <Card.Header>
          <h2>Edit Anime</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control type="text" name="title" value={form.title} onChange={handleInputChange} placeholder="Enter anime title" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleInputChange} placeholder="Enter anime description" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="url" name="image" value={form.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genres</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  placeholder="Type genre or select below"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (genreInput.trim()) addGenre(genreInput.trim());
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (genreInput.trim()) addGenre(genreInput.trim());
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="mb-2">
                {availableGenres.map((genre) => (
                  <Badge key={genre} bg={form.genres.includes(genre) ? "primary" : "secondary"} className="me-2 mb-2" style={{ cursor: "pointer" }} onClick={() => (form.genres.includes(genre) ? removeGenre(genre) : addGenre(genre))}>
                    {genre} {form.genres.includes(genre) && "✓"}
                  </Badge>
                ))}
              </div>

              {form.genres.length > 0 && (
                <div>
                  <strong>Selected:</strong>{" "}
                  {form.genres.map((genre) => (
                    <Badge key={genre} bg="success" className="me-2">
                      {genre}{" "}
                      <span style={{ cursor: "pointer" }} onClick={() => removeGenre(genre)}>
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select name="status" value={form.status} onChange={handleInputChange} required>
                <option value="Planning">Planning</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Episodes</Form.Label>
              <Form.Control type="number" name="episodes" value={form.episodes} onChange={handleInputChange} min="0" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Episodes Watched</Form.Label>
              <Form.Control type="number" name="episodesWatched" value={form.episodesWatched} onChange={handleInputChange} min="0" max={form.episodes || undefined} />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Anime"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/my-list")}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditAnime;
