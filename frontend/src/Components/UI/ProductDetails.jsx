import React, { useState, useEffect } from 'react';
import Ratings from "react-ratings-declarative";
import RelatedProduct from './relatedProducts';
import axios from "axios";
import { Buffer } from 'buffer';
import { Navbar } from '../UI/navbar';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Navigation from "../UI/Navigation";

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";
 export function MedicineDetails() {
    const { medicineID} = useParams();
    const [medicine, setMedicine] = useState(null);
    const [relatedMed, setRelatedMed] = useState(null);
    const [addToCartQueue, setAddToCartQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false); // Flag to prevent concurrent processing
    const navigate = useNavigate();

   // console.log(medicine);
    function changeRating(newRating) {}
    useEffect(() => {
        // Define a function to fetch medicine details
        const fetchMedicineDetails = async () => {
          try {
            const response=await axios.post('http://localhost:8001/patient/medicine/details',{medicineID:medicineID},{ withCredentials: true });
    
            setMedicine(response.data.currentMed);
            setRelatedMed(response.data.relatedMed);

        } catch (error) {
            console.error('Error fetching medicine details:', error);
            // Handle errors here
          }
        };
    
        fetchMedicineDetails();
      }, [medicineID]); 
      const addToCart = async (medicine, quantity) => {
        try {
          const response = await axios.post('http://localhost:8001/cart', {
            productId: medicine._id,
            quantity,
          }, { withCredentials: true });
    
          // Process the response or handle any other logic here
          setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));
    
          // Now that the request is complete, check the queue for more items to process
        } catch (error) {
          // Handle errors here
          // Also, make sure to handle the queue in case of errors
          setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));
    
        }
      };
      const handleBuyNow = async (medicine, quantity) => {
         await addToCart(medicine,1);
         navigate('/cart');
      };
      useEffect(() => {
        const processQueue = async () => {
          if (!processingQueue && addToCartQueue.length > 0) {
            const nextCartItem = addToCartQueue[0];
            const { medicine, quantity } = nextCartItem;
    
            setProcessingQueue(true);
    
            await addToCart(medicine, quantity);
            //setAddToCartQueue((prevQueue) => prevQueue.slice(1)); // Remove the processed item
            setProcessingQueue(false); // Release the processing flag
          }
        };
    
        processQueue();
      }, [addToCartQueue, processingQueue]);
      const handleAddToCart = (medicine, quantity) => {
        // Add the item to the queue
        setAddToCartQueue((prevQueue) => [...prevQueue, { medicine, quantity }]);
        // Start processing the queue if it's not already being processed
      };
    if (!medicine) {
        return <div>Loading or No Data Found</div>; // Handle the case where Medicine is undefined/null
      }
    return(
        <>
            <Navbar />
            <Navigation
      pagetitle={""}/>


        <div className="container mt-5 py-4 px-xl-5">
         <div className="row mb-4">
        <div className="d-none d-lg-block col-lg-1">
          <div className="image-vertical-scroller">
            <div className="d-flex flex-column">
              {Array.from({ length: 10 }, (_, i) => {
                let selected = i !== 1 ? "opacity-6" : "";
                return (
                  <a key={i} href="">
                    <img
                      className={"rounded mb-2 ratio " + selected}
                      src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
                        medicine.Image.data
                      ).toString('base64')}`}
                      alt={medicine.Name}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
    
        <div className="col-lg-6">
          <div className="row">
            <div className="col-12 mb-4">
              <img
                className="border rounded ratio ratio-1x1"
                src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
                    medicine.Image.data
                  ).toString('base64')}`}
                  alt={medicine.Name}
              />
            </div>
            </div>
            </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column h-100">
            <h2 className="mb-1">{medicine && medicine.Name}</h2>
            <h4 className="text-muted mb-4">${medicine.Price}</h4>

            <div className="row g-3 mb-4">
              <div className="col">
                <button className="btn btn-outline-dark py-2 w-100" onClick={() => addToCart(medicine, 1)}>
                  Add to cart
                </button>
              </div>
              <div className="col">
                <button className="btn btn-dark py-2 w-100" onClick={() => handleBuyNow(medicine, 1)}>Buy now</button>
              </div>
            </div>

            <h4 className="mb-0">{medicine.Details}</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">Code</dt>
              <dd className="col-sm-8 mb-3">{medicine._id}</dd>

              <dt className="col-sm-4">Medicinal use</dt>
              
              
              <dd className="col-sm-8 mb-3">
              {medicine.MedicinalUse.map((use, index) => (
                <span key={index}>
                  {use}
                  {index < medicine.MedicinalUse.length - 1 && ','} 
                </span>
              ))}
            </dd>
                      

              <dt className="col-sm-4">Manufacturer</dt>
              <dd className="col-sm-8 mb-3">{medicine.Name}</dd>

              <dt className="col-sm-4">Age Range</dt>
              <dd className="col-sm-8 mb-3"> greater than 12 years old</dd>

              <dt className="col-sm-4">Status</dt>
              <dd className="col-sm-8 mb-3">{medicine.Quantity>0 ? "Instock" :"Out of stcok"}</dd>

              <dt className="col-sm-4">Rating</dt>
              <dd className="col-sm-8 mb-3">
                <Ratings
                  rating={4.5}
                  widgetRatedColors="rgb(253, 204, 13)"
                  changeRating={changeRating}
                  widgetSpacings="2px"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    return (
                      <Ratings.Widget
                        key={i}
                        widgetDimension="20px"
                        svgIconViewBox="0 0 19 20"
                        svgIconPath={iconPath}
                        widgetHoverColor="rgb(253, 204, 13)"
                      />
                    );
                  })}
                </Ratings>
              </dd>
            </dl>

            <h4 className="mb-0">Description</h4>
            <hr />
            <p className="lead flex-shrink-0">
              <small>
              {medicine.Name} offers a comprehensive solution for {medicine.MedicinalUse}. This medication is designed to cure any pain due to {medicine.MedicinalUse}. Its innovative formula ensures full and safe recovery. 

Patients may experience headaches and abdominal pain, although they are typically mild and transient. It is recommended to consult your doctor before proceeding with this medicine.This medicine is intended for ages grater than 12 years old. As with any medication, it is crucial to follow the guidelines as per prescribed by your doctor. Always consult with a healthcare professional before starting any new medication.

Remember, specific medicine descriptions should adhere to accurate medical information and guidelines, considering individual product details, intended use, dosage, and potential side effects. Always seek professional advice or refer to the product's official information for precise and tailored guidance.
              </small>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <hr />
          <h4 className="text-muted my-4">Related products</h4>
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
          {relatedMed.map((med) => (
              
                <RelatedProduct relatedMed={med}/>
            
            ))}
          </div>
        </div>
      </div>
          </div>
            </>

    );

}
export default MedicineDetails;