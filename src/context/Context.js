import { createContext,useState,useEffect } from "react";
import { fetchDatafromApi } from "../utils/api";

 export const Context=createContext();

 export const AppContext=(props)=>{ 
           const[loading,setLoading]=useState(false)
           const[searchResults,setSearchResults]=useState([]);
           const[selectCategories,setSelectCategories]=useState("New");
           const[mobileMenue,setMobileMenue]=useState(false);


             useEffect(()=>{
              fetchSelectedCategoryData(selectCategories)
             },[selectCategories])    

           const fetchSelectedCategoryData=(query)=>{
                    setLoading(true);
                    fetchDatafromApi(`search/?q=${query}`).then(
                        (res)=>{
                          
                             console.log(res)
                            setSearchResults(res?.items)
                            setLoading(false)
                        }
                    )
                    
                  
              }
              // console.log(searchResults)
              

  return(
           <Context.Provider  value={{
            loading, setLoading,
              searchResults,setSearchResults,
              selectCategories,setSelectCategories,
              mobileMenue,setMobileMenue
           }}    >
            {props.children}
        </Context.Provider>
    );


 }