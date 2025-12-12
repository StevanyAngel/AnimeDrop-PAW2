import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, Button, Badge, Spinner, Alert } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { AxiosError } from "axios";

interface Notification {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  type: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

interface ErrorResponse {
  message: string;
}

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get("/notifications");
      setNotifications(response.data.data || []);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await ApiClient.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await ApiClient.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ApiClient.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return "👥";
      case "review":
        return "⭐";
      case "system":
        return "📢";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          🔔 Notifications
          {unreadCount > 0 && (
            <Badge bg="danger" className="ms-2">
              {unreadCount}
            </Badge>
          )}
        </h2>
        {unreadCount > 0 && (
          <Button variant="outline-primary" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem" }}>🔔</div>
            <p className="mt-3">No notifications yet</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {notifications.map((notification) => (
              <ListGroup.Item key={notification._id} className={!notification.read ? "bg-light" : ""}>
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{ fontSize: "2rem" }}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <img src={notification.sender.avatar} alt={notification.sender.username} width="30" height="30" className="rounded-circle me-2" />
                      <Link to={`/users/${notification.sender._id}`} className="text-decoration-none fw-bold">
                        {notification.sender.username}
                      </Link>
                      {!notification.read && (
                        <Badge bg="primary" className="ms-2">
                          New
                        </Badge>
                      )}
                    </div>

                    <p className="mb-2">{notification.message}</p>

                    <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>

                    <div className="mt-2">
                      {notification.link && (
                        <Button variant="link" size="sm" className="p-0 me-3" onClick={() => navigate(notification.link)}>
                          View
                        </Button>
                      )}
                      {!notification.read && (
                        <Button variant="link" size="sm" className="p-0 me-3" onClick={() => handleMarkAsRead(notification._id)}>
                          Mark as read
                        </Button>
                      )}
                      <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDelete(notification._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
}

export default Notifications;
