import React, {useEffect, useState} from 'react';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import FileBase from 'react-file-base64';

function MediumModal({
  modalTitle = 'Edit Product',
  exitAction = () => {},
  confirmAction = () => {},
  product = {
    name: '',
    price: '',
    description: '',
    categoryId: {},
    image: '',
    gauges: [14,16,18,20],
  },
}) {
  const [name, setName] = useState(product.name);
  const [gauges, setGauges] = useState(product.gauges);
  const [image, setImage] = useState(product.image);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [selectedCategory, setSelectedCategory] = useState(product.categoryId);
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [listingData, setListingData] = useState({
    selectedFile: product.image,
  });
  

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/categories',
    })
      .then((res) => {
        setAllCategories(res.data);
      })
      .catch((err) => console.log(err));  
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gauges || !selectedCategory) return alert('Please fill all the fields');
    const data = {
      name,
      gauges,
      image,
      price,
      categoryId: selectedCategory._id,
      description,
    };
    axios({
      method: 'put',
      url: `http://localhost:3000/products/${product._id}`,
      data,
    }).then(() => {
      setSuccess('product uploaded');
      exitAction();
    }).catch((err) => setError(err.response.data.message));
    
  }
  useEffect(() => {
    setImage(listingData.selectedFile)
  }, [listingData])
  
  return (
    <div className='fixed w-full min-h-screen left-0 top-0 bg-black backdrop-blur-sm bg-opacity-20 flex justify-center z-50 items-center'>
      <div className='bg-gray-300 rounded-lg md:min-w-[700px] md:w-min w-11/12   overflow-y-auto text-center'>
        <button className='flex w-full justify-end' onClick={exitAction}>
          <RxCross2 size={22} className='mr-4 mt-4 text-gray-700' />
        </button>
        <div className='w-full flex justify-center mb-4'>
          <h1 className='text-lg font-bold'>{modalTitle ? modalTitle : ''}</h1>
        </div>
        <div className='md:px-10 sm:px-5 px-4 md:py-6 sm:py-4 py-4 overflow-y-auto max-h-[500px] mb-4 mx-2'>
          <div className='w-full flex flex-col justify-center items-center mb-6'>
            <div className='flex flex-col gap-5 w-full text-black'>
              <input className='px-2 py-1 rounded-sm' type="text" placeholder="Name of Product" value={name} onChange={(e) => setName(e.target.value)} />
              <input className='px-2 py-1 rounded-sm' type="text" placeholder="Guages of the Product" value={gauges} onChange={(e) => setGauges(e.target.value.split(','))} />
              <input className='px-2 py-1 rounded-sm' type="text" placeholder="Price of Product" value={price} onChange={(e) => setPrice(e.target.value)} />
              <select className='px-2 py-1 rounded-sm' onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory._id}>
                {
                  !selectedCategory && <option>Select One Category</option> 
                }
                {allCategories.map((category, index) => (
                  <option value={category._id} key={index} selected={selectedCategory===category._id?true:false}>{category.name}</option>
                ))}
              </select>
              <input  className='px-2 py-1 rounded-sm' type="text" placeholder="Description of the Product" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className='bg-white p-2 rounded-sm'>
                <FileBase type="file" multiple={false} onDone={({base64}) => setListingData({ ...listingData, selectedFile: base64})} />
                <div className='p-2 rounded-sm bg-white flex items-center justify-center'>
                  <img src={image} alt="Image Preview" className='w-full max-w-[200px]'/>
                </div>
              </div>
              {
                error &&
                  <p style={{color: "red"}}>{error}</p>
              }
              {
                success &&
                  <p style={{color: "green"}}>{success}</p>
              }
            </div>
          </div>
          <button
            className='bg-blue-500 text-white px-3 py-2 rounded-md font-semibold'
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediumModal;