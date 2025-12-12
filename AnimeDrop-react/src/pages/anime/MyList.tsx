import { useCallback, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Button, Table, Badge, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface Anime {
  _id: string;
  title: string;
  status: string;
  genres: string[];
  episodes: number;
  episodesWatched: number;
  averageRating: number;
  image: string;
}

interface ErrorResponse {
  message: string;
}

function MyList() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnimes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get("/anime/my-list");

      if (response.status === 200) {
        setAnimes(response.data.data || response.data);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  const handleDelete = async (animeId: string) => {
    if (!window.confirm("Are you sure you want to delete this anime?")) return;

    try {
      const response = await ApiClient.delete(`/anime/${animeId}`);

      if (response.status === 200) {
        fetchAnimes();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error("Error deleting anime:", error.response?.data?.message || "Failed to delete");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Completed: "success",
      Watching: "primary",
      Planning: "warning",
      "On Hold": "secondary",
      Dropped: "danger",
    };
    return variants[status] || "secondary";
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Anime List</h2>
        <NavLink to="/add-anime">
          <Button variant="primary">+ Add Anime</Button>
        </NavLink>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : animes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">You haven't added any anime yet</p>
          <NavLink to="/add-anime">
            <Button variant="primary">Add Your First Anime</Button>
          </NavLink>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animes.map((anime, index) => (
              <tr key={anime._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={anime.image} alt={anime.title} width="50" height="75" style={{ objectFit: "cover" }} />
                </td>
                <td>
                  <Link to={`/anime/${anime._id}`} className="text-decoration-none">
                    {anime.title}
                  </Link>
                  <div className="mt-1">
                    {anime.genres.slice(0, 3).map((genre, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>
                  <Badge bg={getStatusBadge(anime.status)}>{anime.status}</Badge>
                </td>
                <td>
                  {anime.episodesWatched}/{anime.episodes || "?"}
                </td>
                <td>{anime.averageRating > 0 ? <span>⭐ {anime.averageRating}</span> : <span className="text-muted">No rating</span>}</td>
                <td>
                  <Link to={`/edit-anime/${anime._id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(anime._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MyList;
