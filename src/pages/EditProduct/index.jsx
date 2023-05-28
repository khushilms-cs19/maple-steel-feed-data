import React, {useEffect, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import axios from 'axios';
import {BiEdit} from 'react-icons/bi';
import MediumModal from '../../components/EditProductModal';
import {BiArrowBack} from 'react-icons/bi';
import {AiFillDelete} from 'react-icons/ai';

const ProductCard = ({product})=>{
  const [editProductModal, setEditProductModal] = useState(false);
  const [productData, setProductData] = useState({});
  const closeModal = ()=>{
    setEditProductModal(false);
  }
  const openModal = ()=>{
    setEditProductModal(true);
  }
  const deleteProduct = async ()=>{
    const response = confirm('Are you sure you want to delete this product?')
    if(response){
      await axios({
        method: 'delete',
        url: `http://localhost:3000/products/${product._id}`
      }).then(res=>{
        window.location.reload();
      }).catch(err=>console.log(err))
    }
  }
  return (
    <div className='p-4 border border-red-400 w-96 text-white rounded-md relative flex gap-4'>
      {
        editProductModal && <MediumModal product={product} exitAction={closeModal} filler={false} confirmAction={closeModal} />
      }
      <img src={product.image} alt="No Image" className='w-24 object-cover bg-gray-500'/>
      <div>
        <div>
          <BiEdit className='absolute right-2 top-2 text-red-400 cursor-pointer' size={24} onClick={openModal}/>
          <AiFillDelete className='absolute right-2 top-8 text-red-400 cursor-pointer' size={24} onClick={deleteProduct}/>
        </div>
        <p>Name: {product.name}</p>
        <p>Price: {product.price?product.price: "-"}</p>
        <p>Description: {product.description?product.price: "-"}</p>
      </div>
    </div>
  )
}

function EditProduct() {
  const [allCategories, setAllCategories] = useState([]);
  const [width, height] = useWindowSize();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const getCategoryProducts = async (id) => {
    await axios({
      method: 'get',
      url: `http://localhost:3000/products`,
      params: {
        category: id
      }
    }).then(res => {
      setCategoryProducts(res.data)
      return res.data;
    }).catch(err => console.log(err))
  }
  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(res => res.json())
      .then(data => {
        setAllCategories(data)
        setSelectedCategory(data[0])
      })
  }, [])
  useEffect(()=>{
    if(selectedCategory) getCategoryProducts(selectedCategory._id)
  }, [selectedCategory])
  return (
    <div className='w-screen min-h-screen bg-blue-900'>
      <div className='w-full relative'>
      <BiArrowBack className='absolute top-5 left-5 text-red-400 text-2xl cursor-pointer' onClick={() => window.history.back()} />
      <p className='text-red-400 font-bold text-2xl w-full text-center border-b-2 border-blue-700 h-[80px] items-center justify-center flex'>Edit a Product</p>
      </div>
      <div className='flex'>
        <div className='w-64 border-r-2 border-blue-700 h-full flex flex-col gap-5 p-5' style={{height: height-80 }}>
          {
            allCategories.map((category, key) => {
              return (
                <p key={key} className={`${selectedCategory._id === category._id?"bg-blue-500":"bg-red-400"} rounded-md px-2 py-1 hover:bg-blue-500 cursor-pointer`} onClick={()=>setSelectedCategory(category)}>{category.name}</p>
              )
          })
        }
        </div>
        <div style={{height: height - 80}} className='overflow-auto w-full flex flex-wrap gap-4 p-5'>
          {
            categoryProducts.map((product, key) => {
              return <ProductCard key={key} product={product} />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default EditProduct;