import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Redirect({redirectAddress}) {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate(redirectAddress);
  },[]);
  return (
    <div>404 Not Found</div>
  )
}

export default Redirect;