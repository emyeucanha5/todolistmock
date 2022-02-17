import React, { useState, useContext, useEffect } from 'react'
import { useRef } from "react";


const AppContext = React.createContext();
const getLS = (id, value) => {
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}

const map1 = {
    low: 1,
    normal: 2,
    high: 3,
}
const AppProvider = ({ children }) => {
    const bulkref = useRef(0);
    const [display, setDisplay] = useState(null);
    const [inp, setInp] = useState({
        title: "",
        description: "",
        date: "",
        priority: "normal",
    });
    const [update, setUpdate] = useState({
        id: 0,
        title: "",
        description: "",
        date: "",
        priority: "normal",
    });
    const [search, setSearch] = useState("");
    const [list, setList] = useState(getLS());
    const [displayList, setDisplaylist] = useState(getLS())
    useEffect(
        () => {
          localStorage.setItem("list", JSON.stringify(list));
          const tmpList = list.sort((v1,v2) => {
            if(v1.dateValue > v2.dateValue) return 1;
            if(v1.dateValue < v2.dateValue) return -1;     
            if(v1.priorityNumber < v2.priorityNumber) return 1;
            if(v1.priorityNumber > v2.priorityNumber) return -1;
        });
                
        
        setList(tmpList);
          if(!search){
              setDisplaylist(tmpList);
          }
        }

        ,[list])
    useEffect(
        () => {
            if(!search){ 
                setDisplaylist(list);
            }else{
                const tmpList = list.filter(item => item.title.startsWith(search)==true);
                setDisplaylist(tmpList);
            }
        }
    ,[list])
    useEffect(
        () => {
            if(!search){ 
                setDisplaylist(list);
            }else{
                const tmpList = list.filter(item => item.title.startsWith(search)==true);
                setDisplaylist(tmpList);
            }
        }
    ,[search]);
    const handleChange = (e) =>{
        const prop = e.target.name;
        const val = e.target.value;
        setInp({...inp, [prop]: val});
    }
    const handleSubmit = (e) =>{
        e.preventDefault();    
        if(!inp.title){
            alert("Please enter a name for task");
            setInp({
                title: "",
                description: "",
                date: "",
                priority: "normal",
            })
            return 0;
        }else if(!inp.date){
            alert("Please enter a specific deadline for this task");
            setInp({
                title: "",
                description: "",
                date: "",
                priority: "normal",
            })
            return 0;
        }else if(inp.date){
            let tempDate = new Date();
            const dateinfo = inp.date.split('-');
            const year = Number(dateinfo[0]);
            const month =  Number(dateinfo[1]);
            const day =  Number(dateinfo[2]);
            const newDate = new Date(year, month, day);
            if(year - tempDate.getFullYear() > 100){
                alert("Invalid deadline (more than 100 years)");
                setInp({
                    title: "",
                    description: "",
                    date: "",
                    priority: "normal",
                })
                return 0;
            }
            if(tempDate>newDate){
                alert("Invalid deadline ( it must be after today )");
                setInp({
                    title: "",
                    description: "",
                    date: "",
                    priority: "normal",
                })
                return 0;
            }
            let tmpMap = [...list, {
                id: new Date().getTime().toString(),
                title: inp.title,
                description: inp.description,
                date: inp.date,
                priority: inp.priority,
                dateValue: newDate.getTime(),
                priorityNumber: map1[inp.priority],
                done: false,
            }];
            setList(tmpMap);

        }       
        setInp({
            title: "",
            description: "",
            date: "",
            priority: "normal",
        })
        setDisplay(null);
        bulkref.current.style.display = "none";
    }
    const handleRemove = (e,id) => {
        e.preventDefault();
        const newInp = list.filter(item => item.id !== id );
        setList(newInp);
        setDisplay(null);
        bulkref.current.style.display = "none";
    }
    const handleDetail = (e,id,title, date, priority) => {
        e.preventDefault();
        if(!display || display !== id){
            setDisplay(id);
            bulkref.current.style.display = "grid";
            setUpdate({
                id:id,
                title: title,
                date: date,
                priority: priority,
                date: date,
            });
            
        }else if(display === id){
            setDisplay(null);
            bulkref.current.style.display = "none";
            setUpdate({
                id: 0,
                title: "",
                description: "",
                date: "",
                priority: "normal",
            });
        }
    }
    const handleUpdate = (e) => {
        const prop = e.target.name;
        const val = e.target.value;
        setUpdate({...update, [prop]: val});
    }
    const handleUpdateSubmit = (e,id) => {
        e.preventDefault(); 
        if(!update.title){
            alert("Please enter a name for task");
            setUpdate({
                id: 0,
                title: "",
                description: "",
                date: "",
                priority: "normal",
            })
            return 0;
        }else if(!update.date){
            alert("Please enter a specific deadline for this task");
            setUpdate({
                id: 0,
                title: "",
                description: "",
                date: "",
                priority: "normal",
            })
            return 0;
        }else if(update.date){
            let tempDate = new Date();
            const dateinfo = update.date.split('-');
            const year = Number(dateinfo[0]);
            const month =  Number(dateinfo[1]);
            const day =  Number(dateinfo[2]);
            const newDate = new Date(year, month, day);
            if(year - tempDate.getFullYear() > 100){
                alert("Invalid deadline (more than 100 years)");
                setUpdate({
                    id: 0,
                    title: "",
                    description: "",
                    date: "",
                    priority: "normal",
                })
                return 0;
            }
            if(tempDate>newDate){
                alert("Invalid deadline ( it must be after today )");
                setUpdate({
                    id: 0,
                    title: "",
                    description: "",
                    date: "",
                    priority: "normal",
                })
                return 0;
            }
        const tmpMap = list.map(item => {
            if(item.id===id){
                return {
                    id:id,
                    title: update.title,
                    date: update.date,
                    priority: update.priority,
                    description: update.description,
                    dateValue: newDate.getTime(),
                    done: item.done,
                    priorityNumber: item.priorityNumber,
                }
            }
            return item;
        });
        setList(tmpMap);
        setDisplay(null);
        bulkref.current.style.display = "none";
    }
    }
    const Done = (e, id) => {
        e.preventDefault();
        const tmpList = list.map((item) => {
            if(item.id ===id){
                item.done = !item.done;
            }
            return item;
        })
        setList(tmpList);
    }
    const searchEngine = (e) => {
        const val = e.target.value;
        setSearch(val);
    }


	return <AppContext.Provider value={{
        ...inp,
        update,
        list,
        bulkref,
        display,
        displayList,
        handleChange,
        handleSubmit,
        handleRemove,
        handleUpdateSubmit,
        handleUpdate,
        Done,
        handleDetail,
        searchEngine,

	}}>
	  {children}
  	</AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }