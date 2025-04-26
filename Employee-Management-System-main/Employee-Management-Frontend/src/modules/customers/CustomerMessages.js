import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerMessages = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, sent

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    fetchMessages();
  }, [auth, navigate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/customer/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      const { sent = [], received = [] } = response.data;
      setMessages([...sent, ...received]); // ✅ Combine for display
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again later.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.post(
        `http://localhost:8080/customer/messages/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
      setError("Failed to mark message as read. Please try again.");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/customer/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message. Please try again.");
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "unread") return !message.isRead;
    if (filter === "sent") return message.sender?.id === userId;
    return true; // all
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title mb-0">Messages</h2>
                <div className="btn-group">
                  <button
                    className={`btn btn-outline-primary ${
                      filter === "all" ? "active" : ""
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    All Messages
                  </button>
                  <button
                    className={`btn btn-outline-primary ${
                      filter === "unread" ? "active" : ""
                    }`}
                    onClick={() => setFilter("unread")}
                  >
                    Unread
                  </button>
                  <button
                    className={`btn btn-outline-primary ${
                      filter === "sent" ? "active" : ""
                    }`}
                    onClick={() => setFilter("sent")}
                  >
                    Sent
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No messages found.</p>
                </div>
              ) : (
                <div className="list-group">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`list-group-item list-group-item-action ${
                        !message.isRead ? "bg-light" : ""
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) {
                          markAsRead(message.id);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">
                          {message.subject}
                          {!message.isRead && (
                            <span className="badge bg-primary ms-2">New</span>
                          )}
                        </h5>
                        <small className="text-muted">
                          {formatDate(message.sentAt)}
                        </small>
                      </div>
                      <p className="mb-1 text-truncate">{message.content}</p>
                      <small className="text-muted">
                        {message.sender?.id === userId
                          ? `To: ${message.recipient?.name}`
                          : `From: ${message.sender?.name}`}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedMessage.subject}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>From:</strong> {selectedMessage.sender?.name}
                </div>
                <div className="mb-3">
                  <strong>To:</strong> {selectedMessage.recipient?.name}
                </div>
                <div className="mb-3">
                  <strong>Date:</strong> {formatDate(selectedMessage.sentAt)}
                </div>
                <div className="border-top pt-3">{selectedMessage.content}</div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
