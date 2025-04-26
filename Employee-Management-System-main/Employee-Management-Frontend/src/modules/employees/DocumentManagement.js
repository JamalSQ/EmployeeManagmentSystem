import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const DocumentManagement = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const [newDocument, setNewDocument] = useState({
    title: "",
    documentType: "",
    content: "",
    status: "DRAFT",
  });

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    fetchDocuments();
    fetchEmployees();
  }, [auth, navigate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        "http://localhost:8080/employee/documents",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const employeeUsers = response.data.filter(
        (user) => user.role === "EMPLOYEE"
      );
      setEmployees(employeeUsers);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again later.");
    }
  };

  // const handleCreateDocument = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     setError("");
  //     setSuccess("");

  //     const response = await axios.post(
  //       "http://localhost:8080/employee/documents",
  //       newDocument,
  //       {
  //         params: {
  //           createdById: userId,
  //           assignedToId: selectedEmployeeId || null,
  //         },
  //         headers: {
  //           Authorization: `Bearer ${auth.token}`,
  //         },
  //       }
  //     );

  //     setSuccess("Document created successfully!");
  //     setShowCreateModal(false);
  //     setNewDocument({
  //       title: "",
  //       documentType: "",
  //       content: "",
  //       status: "DRAFT",
  //     });
  //     setSelectedEmployeeId("");
  //     fetchDocuments();
  //   } catch (error) {
  //     console.error("Error creating document:", error);
  //     setError(
  //       error.response?.data?.message ||
  //         "Failed to create document. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post(
        "http://localhost:8080/employee/documents",
        {
          title: newDocument.title,
          documentType: newDocument.documentType,
          content: newDocument.content,
          status: "DRAFT",
          fileName: "placeholder.txt", // ✅ required
          filePath: "/documents/placeholder.txt", // ✅ required
          employee: {
            id: selectedEmployeeId || userId, // ✅ assuming employee = user
          },
        },
        {
          params: {
            createdById: userId,
            assignedToId: selectedEmployeeId || null,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccess("Document created successfully!");
      setShowCreateModal(false);
      setNewDocument({
        title: "",
        documentType: "",
        content: "",
        status: "DRAFT",
      });
      setSelectedEmployeeId("");
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `http://localhost:8080/employee/documents/${selectedDocument.id}`,
        selectedDocument,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccess("Document updated successfully!");
      setShowViewModal(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/csv",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid file type (PDF, Word, or CSV)");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Create a unique filename
      const timestamp = new Date().getTime();
      const fileExtension = selectedFile.name.split(".").pop();
      const uniqueFileName = `${timestamp}_${selectedFile.name}`;

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);
      formData.append("fileName", uniqueFileName);

      // Upload the file
      const response = await axios.post(
        "http://localhost:8080/employee/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Document uploaded successfully!");
        setShowUploadModal(false);
        setSelectedFile(null);
        setDocumentType("");
        fetchDocuments();
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setError(
        error.response?.data?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axios.delete(
        `http://localhost:8080/employee/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccess("Document deleted successfully!");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-secondary";
      case "SUBMITTED":
        return "bg-primary";
      case "APPROVED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  if (loading && documents.length === 0) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Document Management</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create New Document
                </button>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Assigned To</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document) => (
                      <tr key={document.id}>
                        <td>{document.title}</td>
                        <td>{document.documentType}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              document.status
                            )}`}
                          >
                            {document.status}
                          </span>
                        </td>
                        <td>{document.createdBy?.name || "Unknown"}</td>
                        <td>{document.assignedTo?.name || "Unassigned"}</td>
                        <td>
                          {format(new Date(document.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => {
                              setSelectedDocument(document);
                              setShowViewModal(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateDocument}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={newDocument.title}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="documentType" className="form-label">
                      Document Type
                    </label>
                    <select
                      className="form-select"
                      id="documentType"
                      value={newDocument.documentType}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          documentType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select document type</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="REPORT">Report</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      Content
                    </label>
                    <textarea
                      className="form-control"
                      id="content"
                      rows="5"
                      value={newDocument.content}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          content: e.target.value,
                        })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">
                      Assign To
                    </label>
                    <select
                      className="form-select"
                      id="assignedTo"
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                      <option value="">Select an employee...</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating...
                        </>
                      ) : (
                        "Create Document"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Document Modal */}
      {showViewModal && selectedDocument && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateDocument}>
                  <div className="mb-3">
                    <label htmlFor="viewTitle" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="viewTitle"
                      value={selectedDocument.title}
                      onChange={(e) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="viewDocumentType" className="form-label">
                      Document Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="viewDocumentType"
                      value={selectedDocument.documentType}
                      onChange={(e) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          documentType: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="viewContent" className="form-label">
                      Content
                    </label>
                    <textarea
                      className="form-control"
                      id="viewContent"
                      rows="5"
                      value={selectedDocument.content}
                      onChange={(e) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          content: e.target.value,
                        })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="viewStatus" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="viewStatus"
                      value={selectedDocument.status}
                      onChange={(e) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <p>
                      <strong>Created By:</strong>{" "}
                      {selectedDocument.createdBy?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Assigned To:</strong>{" "}
                      {selectedDocument.assignedTo?.name || "Unassigned"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {format(
                        new Date(selectedDocument.createdAt),
                        "MMM dd, yyyy hh:mm a"
                      )}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {format(
                        new Date(selectedDocument.updatedAt),
                        "MMM dd, yyyy hh:mm a"
                      )}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowViewModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        "Update Document"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label htmlFor="documentType" className="form-label">
                      Document Type
                    </label>
                    <select
                      className="form-select"
                      id="documentType"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      required
                    >
                      <option value="">Select document type</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="REPORT">Report</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                      Select File to Upload
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="file"
                      onChange={handleFileChange}
                      required
                      accept=".pdf,.doc,.docx,.csv"
                    />
                    <div className="form-text">
                      Supported formats: PDF, Word (DOC, DOCX), CSV
                    </div>
                    {selectedFile && (
                      <div className="mt-2">
                        <strong>Selected file:</strong> {selectedFile.name}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Uploading...
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
