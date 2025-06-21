import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
// ... other imports remain the same ...

const CommunityDetails = () => {
  // ... existing state declarations remain the same ...

  // Fetch blogs - now wrapped with useCallback
  const fetchBlogs = useCallback(async () => {
    setLoadingBlogs(true);
    setBlogError('');
    
    try {
      const res = await api.get(`/blogs/community/${id}`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogError('Failed to load blogs. Please try again later.');
    }
    
    setLoadingBlogs(false);
  }, [id]);

  // Fetch events - now wrapped with useCallback
  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get(`/communities/${id}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [id]);

  // Fetch community details - updated with dependencies
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        console.log('Fetching community details for ID:', id);
        console.log('Current user:', user);
        const res = await api.get(`/communities/${id}`);
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
        const materialsRes = await api.get(`/materials/community/${id}`);
        console.log('Materials response:', materialsRes.data);
        setMaterials(materialsRes.data);
        
        // Fetch blogs
        fetchBlogs();

        // Fetch events
        fetchEvents();
      } catch (error) {
        // ... error handling remains the same ...
      }
      setLoading(false);
    };

    fetchCommunityDetails();
  }, [id, user, fetchBlogs, fetchEvents]); // Added fetchBlogs and fetchEvents to dependencies

  // ... rest of the component code remains the same ...

  // Check if user is admin of this community
  const isAdmin = community && user && (community.admin._id === user.id || community.admin._id === user._id);
  
  // Removed the unused isMember variable assignment

  // ... rest of the component code remains the same ...
};

export default CommunityDetails;
