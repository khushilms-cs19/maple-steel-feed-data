import './App.css';
import { useEffect, useState } from 'react';
import FileBase from 'react-file-base64';
import axios from 'axios';

function App() {
  const [name, setName] = useState('')
  const [guages, setGuages] = useState([14,16,18,20])
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  // const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listingData, setListingData] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !guages || !selectedCategory ) return alert('Please fill all the fields');
    const data = {
      name,
      guages,
      image,
      price,
      categoryId: selectedCategory,
      description
    }
    
    await axios({
      method: 'post',
      url: 'http://localhost:3000/products',
      data
    }).then(()=>setSuccess("product uploaded")).catch(err => setError(err.response.data.message))
    setName('')
    setGuages([14,16,18,20])
    setImage('')
    setPrice('')
    setSelectedCategory('')
    setDescription('')
    setListingData({})
  }

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(data => setAllCategories(data))
  }, [])

  useEffect(() => {
    setImage(listingData.selectedFile)
  }, [listingData])

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
      <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="guages" value={guages} onChange={(e) => setGuages(e.target.value.split(','))} />
      <input type="text" placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        {
          !selectedCategory && <option>Select One Category</option> 
        }
        {allCategories.map((category, index) => (
          <option value={category._id} key={index}>{category.name}</option>
        ))}
      </select>
      <input type="text" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FileBase type="file" multiple={false} onDone={({base64}) => setListingData({ ...listingData, selectedFile: base64})} />
      <img src={image} alt="image" />
      <button onClick={handleSubmit}>Submit</button>
      {
        error &&
      <p style={{color: "red"}}>{error}</p>
      }
      {
        success &&
      <p style={{color: "green"}}>{success}</p>
      }
    </div>
  )
}

export default App