
import { useEffect, useState } from 'react';
import FileBase from 'react-file-base64';
import axios from 'axios';
import {IoIosArrowDropdownCircle} from 'react-icons/io';
import {BiArrowBack} from 'react-icons/bi';

const transformProducts = (products)=>{
  console.log(products);
  const startingWords = products.map((product)=>{
    return product.name.split(' ')[0];
  });
  const uniqueStartingWords = [...new Set(startingWords)];
  let transformedProducts = uniqueStartingWords.reduce((acc, word)=>{
    acc[word] = products.filter((product)=>{
      return product.name.startsWith(word);
    });
    return acc;
  }, {});
  console.log(transformedProducts);
  return transformedProducts;
}

function AddProduct() {
  const [name, setName] = useState('')
  const [gauges, setGauges] = useState([14,16,18,20])
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  // const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listingData, setListingData] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [tabsOpen, setTabsOpen] = useState([]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !gauges || !selectedCategory ) return alert('Please fill all the fields');
    const data = {
      name,
      gauges,
      image,
      price,
      categoryId: selectedCategory,
      description
    }
    
    await axios({
      method: 'post',
      url: 'http://localhost:3000/products',
      data
    }).then(()=>{setSuccess("product uploaded")
    getCategoryProducts(selectedCategory)
  }).catch(err => setError(err.response.data.message))
    setName('')
    setGauges([14,16,18,20])
    setImage('')
    setPrice('')

    setDescription('')
    setListingData({})
  }

  const getCategoryProducts = async (id) => {
    await axios({
      method: 'get',
      url: `http://localhost:3000/products`,
      params: {
        category: id
      }
    }).then(res => {
      setCategoryProducts(transformProducts(res.data))
      return res.data;
    }).then((products)=>{
      setTabsOpen(Object.keys(products).map(()=>false));
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(data => setAllCategories(data))
  }, [])

  useEffect(() => {
    setImage(listingData.selectedFile)
  }, [listingData])

  useEffect(() => {
    if(selectedCategory) {
      getCategoryProducts(selectedCategory)
    }
  }, [selectedCategory])

  return (
    <div className='w-screen min-h-screen bg-blue-900'>
      <div className='relative'>
        <BiArrowBack className='absolute top-5 left-5 text-red-400 text-2xl cursor-pointer' onClick={() => window.history.back()} />
        <p className='text-red-400 font-bold text-2xl text-center bg-blue-900 py-2'>Add a product</p>

      </div>
    <div className='bg-blue-900 flex md:flex-row flex-col'>
      <div className='flex flex-col gap-5 p-10 md:w-1/2 w-full'>
        <input className='px-2 py-1 rounded-sm' type="text" placeholder="Name of Product" value={name} onChange={(e) => setName(e.target.value)} />
        <input className='px-2 py-1 rounded-sm' type="text" placeholder="Guages of the Product" value={gauges} onChange={(e) => setGauges(e.target.value.split(','))} />
        <input className='px-2 py-1 rounded-sm' type="text" placeholder="Price of Product" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select className='px-2 py-1 rounded-sm' onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {
            !selectedCategory && <option>Select One Category</option> 
          }
          {allCategories.map((category, index) => (
            <option value={category._id} key={index}>{category.name}</option>
          ))}
        </select>
        <input  className='px-2 py-1 rounded-sm' type="text" placeholder="Description of the Product" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className='bg-white p-2 rounded-sm'>
          <FileBase type="file" multiple={false} onDone={({base64}) => setListingData({ ...listingData, selectedFile: base64})} />
          <div className='p-2 rounded-sm bg-white flex items-center justify-center'>
            <img src={image} alt="Image Preview" className='w-full max-w-[200px]'/>
          </div>
        </div>
        <button onClick={handleSubmit} className='bg-red-400 px-2 py-1 rounded-sm text-white font-bold text-2xl hover:bg-blue-500'>Submit</button>
        {
          error &&
        <p style={{color: "red"}}>{error}</p>
        }
        {
          success &&
        <p style={{color: "green"}}>{success}</p>
        }
      </div>
    <div className='flex flex-col gap-4 md:w-1/2 w-full p-10'>
      {
        selectedCategory &&
        <p className='text-red-400 font-bold text-2xl'>Existing Products in Category: {allCategories?.find((category)=>category._id === selectedCategory)?.name}</p>
      }
      {
        Object.keys(categoryProducts).map((key, index) => (
          <>
          <div 
            className='flex gap-5 justify-between items-center w-full bg-red-400 px-2 py-1 rounded-md cursor-pointer' 
            key={index} 
            onClick={()=>{
              setTabsOpen(tabsOpen.map((tab, i)=>i===index?!tab:tab))
            }}
          >
            <p className='font-bold text-2xl text-white'>{key}</p>
            <IoIosArrowDropdownCircle color='white' size={24}/>
          </div>
          {
            tabsOpen[index] &&
            <ul className='flex flex-col list-disc px-10 max-h-[300px] overflow-y-auto'>
              {
                categoryProducts[key].map((product, index) => (
                  <li key={index} className='text-white'>{product.name}</li>
                ))
              }
            </ul>
          }
          </>
        ))
      }
    </div>
    </div>
    </div>

  )
}

export default AddProduct;
