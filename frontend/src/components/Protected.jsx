import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Protected({
  children,
  authentication = true
}) {
  const navigate = useNavigate();
  const { status: authStatus, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log({ authStatus, loading });
    if (loading) return;
    if (authentication && !authStatus) {
      navigate("/auth");
    } else if (!authentication && authStatus) {
      navigate("/my-drive");
    }
    
  }, [authentication, authStatus, navigate, loading]);
  return (
    <>{children}</>
  )
}

export default Protected