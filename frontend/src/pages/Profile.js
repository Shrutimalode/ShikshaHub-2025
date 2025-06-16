import React from 'react';
import { Container, Card, Row, Col, Badge, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  // Function to get role badge
  const getRoleBadge = (role) => {
    let variant = 'secondary';
    
    switch (role) {
      case 'admin':
        variant = 'danger';
        break;
      case 'teacher':
        variant = 'primary';
        break;
      case 'student':
        variant = 'success';
        break;
      default:
        variant = 'secondary';
    }
    
    return (
      <Badge bg={variant} className="px-3 py-2">
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <Container>
      <h2 className="mb-4">My Profile</h2>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4a154b&color=fff&size=128`}
                  alt={user?.name}
                  className="rounded-circle img-thumbnail"
                  width="120"
                />
              </div>
              
              <h4>{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
              
              <div className="mt-3">
                {user && getRoleBadge(user.role)}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>My Communities</Card.Title>
              
              {user?.communities && user.communities.length > 0 ? (
                <ListGroup>
                  {user.communities.map(community => (
                    <ListGroup.Item 
                      key={community._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>{community.name}</div>
                      <Button 
                        as={Link}
                        to={`/communities/${community._id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        View
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">
                  You haven't joined any communities yet.
                </p>
              )}
              
              <div className="mt-3">
                <Button as={Link} to="/dashboard" variant="primary">
                  Browse Communities
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Account Information</Card.Title>
              
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {user?.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {user?.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Role:</strong> {user?.role}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 