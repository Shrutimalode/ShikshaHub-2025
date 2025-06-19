import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Nav, Form, Badge, Alert, Spinner, ListGroup, Modal, InputGroup } from 'react-bootstrap';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import BlogList from '../components/BlogList';
import BlogForm from '../components/BlogForm';
import CommunitySidePanel from '../components/CommunitySidePanel';

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [community, setCommunity] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('materials');
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [joinRequests, setJoinRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogError, setBlogError] = useState('');
  
  // Upload state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    file: null
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  // Member removal state
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  // New state for event creation
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    links: '',
    location: '',
    date: '',
    time: '',
  });
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState('');
  const [events, setEvents] = useState([]);
  
  // Fetch community details
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        console.log('Fetching community details for ID:', id);
        console.log('Current user:', user);
        const res = await api.get(`/api/communities/${id}`);
        console.log('Community details response:', res.data);
        setCommunity(res.data);
        
        // Check for pending join request
        if (res.data.joinRequests && user) {
          const userRequest = res.data.joinRequests.find(
            req => req.user === user.id || req.user === user._id || 
                 (req.user._id && (req.user._id === user.id || req.user._id === user._id))
          );
          
          if (userRequest) {
            setRequestStatus(userRequest.status);
          }
        }
        
        // Also fetch materials
        const materialsRes = await api.get(`/api/materials/community/${id}`);
        console.log('Materials response:', materialsRes.data);
        setMaterials(materialsRes.data);
        
        // Fetch blogs
        fetchBlogs();

        // Fetch events
        fetchEvents();
      } catch (error) {
        console.error('Error fetching community details:', error);
        console.error('Error response:', error.response);
        let errorMessage = 'Failed to load community details. Please try again later.';
        
        if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to view this community.';
          // Set basic community info from error response
          if (error.response.data?.communityBasic) {
            setCommunity(error.response.data.communityBasic);
          }
          
          // Check for pending join request
          if (error.response.data?.joinRequests?.length > 0) {
            setRequestStatus('pending');
          }
        } else if (error.response?.status === 401) {
          errorMessage = 'Authentication error. Please log in again.';
        }
        
        setError(errorMessage);
      }
      setLoading(false);
    };

    fetchCommunityDetails();
  }, [id, user]);
  
  // Fetch blogs
  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    setBlogError('');
    
    try {
      const res = await api.get(`/api/blogs/community/${id}`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogError('Failed to load blogs. Please try again later.');
    }
    
    setLoadingBlogs(false);
  };
  
  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await api.get(`/api/communities/${id}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Optionally, set an error state for events
    }
  };
  
  // Fetch join requests if user is admin
  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (!community || !user) return;
      
      // Check if user is admin
      const isAdmin = community.admin._id === user.id || community.admin._id === user._id;
      
      if (!isAdmin) return;
      
      setLoadingRequests(true);
      
      try {
        const res = await api.get(`/api/communities/${id}/requests`);
        setJoinRequests(res.data);
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
      
      setLoadingRequests(false);
    };
    
    fetchJoinRequests();
  }, [community, user, id]);

  // Handle upload form changes
  const handleUploadChange = (e) => {
    if (e.target.name === 'file') {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0]
      });
    } else {
      setUploadForm({
        ...uploadForm,
        [e.target.name]: e.target.value
      });
    }
  };

  // Handle material upload
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!uploadForm.title || !uploadForm.description || !uploadForm.file) {
      setUploadError('Please fill in all required fields and select a file');
      return;
    }
    
    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('communityId', id);
      formData.append('tags', uploadForm.tags);
      formData.append('file', uploadForm.file);
      
      const res = await api.post('/api/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add new material to the list
      setMaterials([res.data, ...materials]);
      
      // Reset form
      setUploadForm({
        title: '',
        description: '',
        tags: '',
        file: null
      });
      
      // Show success message
      setUploadSuccess('Material uploaded successfully!');
      
      // Reset file input
      document.getElementById('file-upload').value = '';
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Failed to upload material');
      console.error('Error uploading material:', error);
    }
    
    setUploadLoading(false);
  };

  // Handle material deletion
  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await api.delete(`/api/materials/${materialId}`);
        
        // Remove material from list
        setMaterials(materials.filter(material => material._id !== materialId));
      } catch (error) {
        alert('Failed to delete material. Please try again.');
        console.error('Error deleting material:', error);
      }
    }
  };

  // Handle material download
  const handleDownloadMaterial = async (materialId, originalFileName) => {
    try {
      console.log('Debug: User object in handleDownloadMaterial:', user);
      console.log('Debug: Token being sent for download:', token);
      const res = await api.get(`/api/materials/download/${materialId}`, {
        responseType: 'blob', // Important for downloading files
        headers: {
          'x-auth-token': token
        }
      });

      // Create a Blob from the response data
      const blob = new Blob([res.data], { type: res.headers['content-type'] });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element, set its href and download attributes, and click it
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Release the object URL
    } catch (error) {
      alert('Failed to download material. Please try again.');
      console.error('Error downloading material:', error.response || error);
    }
  };

  // Handle material view
  const handleViewMaterial = async (materialId) => {
    try {
      // Open in new tab with view parameter, directly targeting the backend
      // Include the token as a query parameter for authentication
      window.open(`http://localhost:5000/api/materials/download/${materialId}?view=true&token=${token}`, '_blank');

    } catch (error) {
      alert('Failed to view material. Please try again.');
      console.error('Error viewing material:', error);
    }
  };
  
  // Handle join request
  const handleRequestToJoin = async () => {
    setRequestLoading(true);
    setRequestMessage('');
    
    try {
      const res = await api.post('/api/communities/request', {
        communityId: id
      });
      
      setRequestStatus('pending');
      setRequestMessage(res.data.message);
    } catch (error) {
      setRequestMessage(error.response?.data?.message || 'Failed to send join request');
      console.error('Error sending join request:', error);
    }
    
    setRequestLoading(false);
  };
  
  // Handle join request response (approve/reject)
  const handleJoinRequestResponse = async (userId, status) => {
    try {
      await api.put('/api/communities/request/handle', {
        communityId: id,
        userId,
        status
      });
      
      // Update join requests list
      setJoinRequests(joinRequests.filter(request => request.user._id !== userId));
      
      // If approved, update community members
      if (status === 'approved') {
        const updatedRequest = joinRequests.find(request => request.user._id === userId);
        
        if (updatedRequest) {
          const userRole = updatedRequest.user.role;
          
          if (userRole === 'teacher') {
            setCommunity({
              ...community,
              teachers: [...community.teachers, updatedRequest.user]
            });
          } else {
            setCommunity({
              ...community,
              students: [...community.students, updatedRequest.user]
            });
          }
        }
      }
    } catch (error) {
      alert('Failed to process join request. Please try again.');
      console.error('Error processing join request:', error);
    }
  };
  
  // Handle blog deletion
  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/api/blogs/${blogId}`);
        
        // Remove blog from list
        setBlogs(blogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        alert('Failed to delete blog post. Please try again.');
        console.error('Error deleting blog post:', error);
      }
    }
  };
  
  // Handle blog review
  const handleReviewBlog = async (blogId, status, feedback) => {
    try {
      await api.put(`/api/blogs/review/${blogId}`, {
        status,
        reviewComment: feedback
      });
      
      // Refresh blogs to show updated status
      fetchBlogs();
    } catch (error) {
      alert('Failed to review blog post. Please try again.');
      console.error('Error reviewing blog post:', error);
    }
  };

  // Member removal state
  const openRemoveModal = (member, role) => {
    setMemberToRemove({ ...member, role });
    setShowRemoveModal(true);
  };

  const handleRemoveMember = async () => {
    setRemoveLoading(true);
    
    try {
      await api.put('/api/communities/members/remove', {
        communityId: id,
        userId: memberToRemove._id,
        role: memberToRemove.role
      });
      
      // Update community state
      if (memberToRemove.role === 'teacher') {
        setCommunity({
          ...community,
          teachers: community.teachers.filter(t => t._id !== memberToRemove._id)
        });
      } else if (memberToRemove.role === 'student') {
        setCommunity({
          ...community,
          students: community.students.filter(s => s._id !== memberToRemove._id)
        });
      }
      
      setShowRemoveModal(false);
    } catch (error) {
      alert('Failed to remove member. Please try again.');
      console.error('Error removing member:', error);
    }
    
    setRemoveLoading(false);
  };

  // Handle community deletion
  const handleDeleteCommunity = async () => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        await api.delete(`/api/communities/${id}`);
        navigate('/dashboard');
      } catch (error) {
        alert('Failed to delete community. Please try again.');
        console.error('Error deleting community:', error);
      }
    }
  };

  // Check if user is admin of this community
  const isAdmin = community && user && (community.admin._id === user.id || community.admin._id === user._id);
  
  // Check if user is a member of this community
  const isMember = community && user && (
    (isAdmin) || 
    (community.teachers && community.teachers.some(teacher => 
      teacher._id === user.id || teacher._id === user._id
    )) || 
    (community.students && community.students.some(student => 
      student._id === user.id || student._id === user._id
    ))
  );

  // Check if user can delete a material
  const canDeleteMaterial = (material) => {
    return isAdmin || (user && (material.author._id === user.id || material.author._id === user._id));
  };

  // Handle event form changes
  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.time) {
      setEventError('Please fill in all required fields (Title, Description, Date, Time)');
      return;
    }

    setEventLoading(true);
    setEventError('');
    setEventSuccess('');

    try {
      const res = await api.post(`/api/communities/${id}/events`, eventForm);
      setEvents([res.data, ...events]); // Add new event to the list
      setEventSuccess('Event created successfully!');
      setEventForm({
        title: '',
        description: '',
        links: '',
        location: '',
        date: '',
        time: '',
      });
      setShowCreateEventModal(false);
    } catch (error) {
      setEventError(error.response?.data?.message || 'Failed to create event');
      console.error('Error creating event:', error);
    }
    setEventLoading(false);
  };

  // Filter and sort events (upcoming at top, past vanish)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date.split('T')[0]; // Extract YYYY-MM-DD
    const dateB = b.date.split('T')[0]; // Extract YYYY-MM-DD
    const dateTimeA = new Date(`${dateA}T${a.time}`);
    const dateTimeB = new Date(`${dateB}T${b.time}`);
    return dateTimeA - dateTimeB;
  });

  const upcomingEvents = sortedEvents.filter(event => {
    const eventDate = event.date.split('T')[0]; // Extract YYYY-MM-DD
    const eventDateTime = new Date(`${eventDate}T${event.time}`);
    return eventDateTime > new Date();
  });

  // Render loading spinner
  if (loading) {
    return (
      <Container className="spinner-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Render error message with Request to Join button if appropriate
  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          {error}
          {error === 'You do not have permission to view this community.' && user && (
            <div className="mt-3">
              {requestStatus === 'pending' ? (
                <Alert variant="info">
                  Your request to join this community is pending approval from the admin.
                </Alert>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleRequestToJoin}
                  disabled={requestLoading}
                >
                  {requestLoading ? 'Sending Request...' : 'Request to Join'}
                </Button>
              )}
              {requestMessage && (
                <Alert variant="info" className="mt-2">
                  {requestMessage}
                </Alert>
              )}
            </div>
          )}
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {community && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{community.name}</h2>
            <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
          
          <Row>
            {/* Main Content */}
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <Card.Title>Description</Card.Title>
                  <Card.Text>{community.description}</Card.Text>
                  <div className="mt-3">
                    <Badge bg="secondary" className="me-2">
                      {(community.teachers?.length || 0) + (community.students?.length || 0) + 1} Members
                    </Badge>
                    <Badge bg="info" className="me-2">
                      {community.blogs?.length || 0} Blogs
                    </Badge>
                    <Badge bg="primary">
                      {community.materials?.length || 0} Materials
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              <Tab.Container id="community-tabs" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="members">Members</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="materials">Materials</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="blogs">Blogs</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="events">Events</Nav.Link>
                  </Nav.Item>
                  {isAdmin && joinRequests.length > 0 && (
                    <Nav.Item>
                      <Nav.Link eventKey="requests">
                        Join Requests <Badge bg="danger">{joinRequests.length}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="members">
                    <Row>
                      <Col md={4}>
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>Admin</Card.Title>
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                <i className="fas fa-user-shield me-2"></i>
                                {community.admin?.name || 'Admin'}
                              </ListGroup.Item>
                            </ListGroup>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col md={4}>
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>Teachers</Card.Title>
                            {community.teachers?.length > 0 ? (
                              <ListGroup variant="flush">
                                {community.teachers.map(teacher => (
                                  <ListGroup.Item 
                                    key={teacher._id}
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    <span>
                                      <i className="fas fa-chalkboard-teacher me-2"></i>
                                      {teacher.name}
                                    </span>
                                    {isAdmin && (
                                      <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => openRemoveModal(teacher, 'teacher')}
                                      >
                                        <i className="fas fa-user-minus"></i>
                                      </Button>
                                    )}
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-muted small">No teachers have joined yet</p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col md={4}>
                        <Card>
                          <Card.Body>
                            <Card.Title>Students</Card.Title>
                            {community.students?.length > 0 ? (
                              <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {community.students.map(student => (
                                  <ListGroup.Item 
                                    key={student._id}
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    <span>
                                      <i className="fas fa-user-graduate me-2"></i>
                                      {student.name}
                                    </span>
                                    {isAdmin && (
                                      <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => openRemoveModal(student, 'student')}
                                      >
                                        <i className="fas fa-user-minus"></i>
                                      </Button>
                                    )}
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-muted small">No students have joined yet</p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="materials">
                    {materials.length === 0 ? (
                      <Alert variant="info">
                        No materials have been uploaded to this community yet.
                      </Alert>
                    ) : (
                      <ListGroup>
                        {materials.map(material => (
                          <ListGroup.Item 
                            key={material._id}
                            className="material-list-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h5>{material.title}</h5>
                              <p className="mb-1 text-muted">{material.description}</p>
                              <div>
                                <small className="text-muted">
                                  Uploaded by: {material.author?.name || 'Unknown'} | 
                                  {' '}{new Date(material.createdAt).toLocaleString()}
                                </small>
                              </div>
                              {material.tags && material.tags.length > 0 && (
                                <div className="mt-1">
                                  {material.tags.map((tag, index) => (
                                    <Badge 
                                      key={index} 
                                      bg="secondary" 
                                      className="me-1"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="d-flex align-items-center">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="me-2" 
                                onClick={() => handleViewMaterial(material._id)}
                                title="View Material"
                              >
                                <i className="fas fa-eye me-1"></i> View
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="me-2" 
                                onClick={() => handleDownloadMaterial(material._id, material.originalFileName)}
                                title="Download Material"
                              >
                                <i className="fas fa-download me-1"></i> Download
                              </Button>
                              {canDeleteMaterial(material) && (
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  onClick={() => handleDeleteMaterial(material._id)}
                                  title="Delete Material"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </Button>
                              )}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="blogs">
                    {loadingBlogs ? (
                      <div className="text-center py-3">
                        <Spinner animation="border" size="sm" /> Loading blogs...
                      </div>
                    ) : blogError ? (
                      <Alert variant="danger">{blogError}</Alert>
                    ) : (
                      <BlogList 
                        blogs={blogs} 
                        communityId={id} 
                        isAdmin={isAdmin} 
                        onDelete={handleDeleteBlog} 
                        onReview={(blogId, status, feedback) => handleReviewBlog(blogId, status, feedback)}
                      />
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="events">
                    {upcomingEvents.length === 0 ? (
                      <Alert variant="info">
                        No upcoming events for this community.
                      </Alert>
                    ) : (
                      <ListGroup>
                        {upcomingEvents.map(event => (
                          <ListGroup.Item key={event._id} className="event-list-item">
                            <h5>{event.title}</h5>
                            <p className="mb-1">{event.description}</p>
                            {event.links && (
                              <p className="mb-1"><strong>Links:</strong> {event.links}</p>
                            )}
                            {event.location && (
                              <p className="mb-1"><strong>Location:</strong> {event.location}</p>
                            )}
                            <p className="text-muted small">
                              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at <strong>Time:</strong> {event.time}
                            </p>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Tab.Pane>
                  
                  {isAdmin && (
                    <Tab.Pane eventKey="requests">
                      {loadingRequests ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" size="sm" /> Loading join requests...
                        </div>
                      ) : joinRequests.length === 0 ? (
                        <Alert variant="info">No pending join requests</Alert>
                      ) : (
                        <ListGroup>
                          {joinRequests.map(request => (
                            <ListGroup.Item 
                              key={request._id}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <span className="fw-bold">{request.user.name}</span>
                                <span className="text-muted ms-2">({request.user.email})</span>
                                <Badge 
                                  bg={request.user.role === 'teacher' ? 'primary' : 'success'} 
                                  className="ms-2"
                                >
                                  {request.user.role}
                                </Badge>
                                <div className="small text-muted">
                                  Requested: {new Date(request.createdAt).toLocaleString()}
                                </div>
                              </div>
                              <div className="d-flex">
                                <Button 
                                  variant="success" 
                                  size="sm" 
                                  className="me-3"
                                  onClick={() => handleJoinRequestResponse(request.user._id, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => handleJoinRequestResponse(request.user._id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Tab.Container>
            </Col>

            {/* Side Panel */}
            <Col md={4}>
              <CommunitySidePanel 
                communityId={id} 
                isAdmin={isAdmin}
                onDeleteCommunity={handleDeleteCommunity}
                onJoinCommunity={handleRequestToJoin}
                requestStatus={requestStatus}
                requestLoading={requestLoading}
                joinCode={community.joinCode}
                joinCodeDescription="Share this code with others to let them join the community"
                onUploadMaterialClick={() => setShowUploadModal(true)}
                onCreateEventClick={() => setShowCreateEventModal(true)}
              />
            </Col>
          </Row>
          
          {/* Remove Member Modal */}
          <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Remove Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from this community?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleRemoveMember}
                disabled={removeLoading}
              >
                {removeLoading ? 'Removing...' : 'Remove'}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Upload Modal */}
          <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Upload Material</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleUploadMaterial}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={uploadForm.description}
                    onChange={handleUploadChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={uploadForm.tags}
                    onChange={handleUploadChange}
                    placeholder="e.g., lecture, notes, assignment"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    id="file-upload"
                    onChange={handleUploadChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Supported formats: Images, PDFs, Documents, Media files (max 10MB)
                  </Form.Text>
                </Form.Group>
                {uploadError && (
                  <Alert variant="danger" className="mt-3">
                    {uploadError}
                  </Alert>
                )}
                {uploadSuccess && (
                  <Alert variant="success" className="mt-3">
                    {uploadSuccess}
                  </Alert>
                )}
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Uploading...
                    </>
                  ) : (
                    'Upload Material'
                  )}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Create Event Modal */}
          <Modal show={showCreateEventModal} onHide={() => setShowCreateEventModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateEvent}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Links (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="links"
                    value={eventForm.links}
                    onChange={handleEventChange}
                    placeholder="e.g., Google Meet link, registration form"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventChange}
                    placeholder="e.g., Zoom, Auditorium A"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={eventForm.time}
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
                {eventError && (
                  <Alert variant="danger" className="mt-3">
                    {eventError}
                  </Alert>
                )}
                {eventSuccess && (
                  <Alert variant="success" className="mt-3">
                    {eventSuccess}
                  </Alert>
                )}
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={eventLoading}
                >
                  {eventLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default CommunityDetails; 