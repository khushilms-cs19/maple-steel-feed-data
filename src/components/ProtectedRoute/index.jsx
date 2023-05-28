import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ redirect, element }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate(redirect);
    }else{
      axios({
        method: 'get',
        url: 'http://localhost:3000/users/verify',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err.response.data.message);
        navigate(redirect);
      });
  }
  }, [navigate]);
  return element;
}

export default ProtectedRoute;
