import {useCallback, useEffect, useState} from "react";
import {ArrayLocalStorageKey, UserLocalStorageData} from "../Constants/Constants";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment, selectItems, setInitialState} from "../features/counter/counterSlice";
import {selectLoginState, setLoginState, setUserInitialState} from "../features/login/loginSlice";
import {useNavigate} from "react-router-dom";
import {ToWords} from "to-words";
import {RxSpeakerLoud} from "react-icons/rx";

const BoxComponent = (props) => {

    const array = useSelector(selectItems);
    const userData = useSelector(selectLoginState);
    const dispatch = useDispatch();

    const toWords = new ToWords({
        localeCode: 'tr-TR',
    });

    const [words,setWord] = useState("")

    const textToSpeech = () => {
        const value = new SpeechSynthesisUtterance(words)
        window.speechSynthesis.speak(value)
    }

    useEffect(() => {
        let items = localStorage.getItem(ArrayLocalStorageKey);
        if (items) {
            const itemsWithNoSymbol = items.replace(/,/g, '').replace(/\[|\]/g, '')
            let words = toWords.convert(Number(itemsWithNoSymbol));
            const split = words.split(' ')
            const bir = split.indexOf("bir")
            const bin = split.indexOf("bin")

            if (bir === 0 && bin === 1) {
                split.shift()
                const joined = split.join(' ')
                setWord(joined)
            }
            else {
                const joined = split.join(' ')
                setWord(joined)
            }
        }
    },[array])

    const [dataValue,setDataValue] = useState([])

    useEffect(() => {
        let items = localStorage.getItem(ArrayLocalStorageKey);
        try{
            if(!items){
                dispatch(setInitialState(Array(props.value).fill(0)));
            }else{
                items = JSON.parse(items);
                dispatch(setInitialState(items));
            }
        }catch (e){
            dispatch(setInitialState(Array(props.value).fill(0)))
            localStorage.removeItem(ArrayLocalStorageKey);
        }
    }, [props.value,dataValue]);


    const giveMeObject = useCallback((valueOfArrayItem) => {
        let obj = [];
        for(let a = 0; a < valueOfArrayItem; a++){
            obj.push(<div className="box-item"></div>);
        }
        return obj;
    },[])

    const resetData = useCallback(() => {
        dispatch(setInitialState(Array(props.value).fill(0)));
        localStorage.removeItem(ArrayLocalStorageKey);
    }, [props.value]);


    const newData = () => {
        const myArr = []
        for (let i = 0; i < dataValue; i++) {
            myArr.push(i)
            setDataValue(myArr.fill(0))
        }
        localStorage.setItem(ArrayLocalStorageKey,JSON.stringify(myArr));
        setDataValue("")
    }


    const nav = useNavigate()

    const logout = useCallback(() => {
        localStorage.removeItem(UserLocalStorageData);
        dispatch(setLoginState({status: false, username: ""}))
        nav("/login")
    }, [])

    return (
        <>
            <h1>Hosgeldin : {userData.username}</h1>
            <h1>{words}</h1>
            <button type="button" onClick={() => textToSpeech()}><RxSpeakerLoud size={30} /></button>
            <div className="container">
                {
                    array.map((itemValue,index) => {
                        return (
                            <div className="container-top">
                                <button disabled={itemValue === 9} type="button" className="btn-artir"
                                        onClick={() => dispatch(increment(index))}>+
                                </button>
                                <div className="array-item">{itemValue}</div>
                                <button disabled={itemValue === 0} type="button" className="btn-azalt"
                                        onClick={() => dispatch(decrement(index))}>-
                                </button>
                            </div>
                        )
                    })
                }
                <button type="button" className="reset"  onClick={() => resetData()}>Reset</button>
                <button type="button" className="logout"  onClick={() => logout()}>Logout</button>
                <input type="text" className="new-data-input" placeholder="New" value={dataValue} onChange={(e) => setDataValue(e.target.value)}/>
                <button type="button" className="new-data-btn"  onClick={() => newData()}>New Data</button>
                <div className="container-bottom">
                    <div className="box-container">
                        <div style={{display: "flex", flexDirection: "row"}}>
                            {
                                array.map((itemValue) => (
                                    <div style={{height: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                                        {giveMeObject(itemValue)}
                                        <div className="box-item-starter"></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoxComponent;