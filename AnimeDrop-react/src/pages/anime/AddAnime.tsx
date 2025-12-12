import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Badge } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface FormData {
  title: string;
  description: string;
  image: string;
  genres: string[];
  status: string;
  episodes: number;
}

interface ErrorResponse {
  message: string;
}

function AddAnime() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    image: "",
    genres: [],
    status: "Planning",
    episodes: 0,
  });
  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableGenres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "episodes" ? parseInt(value) || 0 : value });
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
    setLoading(true);
    setError("");

    try {
      const response = await ApiClient.post("/anime", form);

      if (response.status === 201) {
        navigate("/my-list");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to add anime");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header>
          <h2>Add New Anime</h2>
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
              <Form.Text className="text-muted">Leave empty for default placeholder image</Form.Text>
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
              <Form.Control type="number" name="episodes" value={form.episodes} onChange={handleInputChange} min="0" placeholder="0" />
              <Form.Text className="text-muted">Enter 0 if unknown</Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Adding..." : "Add Anime"}
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

export default AddAnime;
