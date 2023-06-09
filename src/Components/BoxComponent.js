import {useCallback, useEffect, useState} from "react";
import {ArrayLocalStorageKey, UserLocalStorageData} from "../Constants/Constants";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment, selectItems, setInitialState} from "../features/counter/counterSlice";
import {selectLoginState, setLoginState, setUserInitialState} from "../features/login/loginSlice";
import {useNavigate} from "react-router-dom";
import {ToWords} from "to-words";
import {RxSpeakerLoud} from "react-icons/rx";
import "./style.css"

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
            obj.push(<div className="box-item" style={{borderRadius:"4px"}}></div>);
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


    const navs = useNavigate()
    const loginState = useSelector(selectLoginState);

    useEffect(() => {
        loginState.status ? navs("/") : navs("/login")
    },[])

    return (
        <>
            <div className="main">
                <div className="main-alt">
                    <h1>Hosgeldin : {userData.username}</h1>
                    <h1>{words}</h1>
                    <button className="btn-speech" type="button" onClick={() => textToSpeech()}><RxSpeakerLoud size={30}/></button>
                    <div className="container">
                        <div className="alt-container">
                        {
                            array.map((itemValue, index) => {
                                return (
                                    <div className="container-top-main">
                                        <div className="btn-increase">
                                            <button disabled={itemValue === 9} style={itemValue === 9 ? {cursor:"not-allowed",backgroundColor:"#E7C916"} : {cursor:"pointer"}} type="button" className="btn-artir"
                                                    onClick={() => dispatch(increment(index))}>+
                                            </button>
                                        </div>
                                        <div className="array-item">{itemValue}</div>
                                        <div className="btn-decrease">
                                            <button disabled={itemValue === 0} style={itemValue === 0 ? {cursor:"not-allowed",backgroundColor:"#E7C916"} : {cursor:"pointer"}} type="button" className="btn-azalt"
                                                    onClick={() => dispatch(decrement(index))}>-
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="btn-holder">
                            <button type="button" className="reset" onClick={() => resetData()}>Reset</button>
                            <button type="button" className="logout" onClick={() => logout()}>Logout</button>
                            <input type="text" className="new-data-input" placeholder="New" value={dataValue}
                                   onChange={(e) => setDataValue(e.target.value)}/>
                            <button type="button" className="new-data-btn" onClick={() => newData()}>New</button>
                        </div>
                        <div className="container-bottom">
                            <div className="box-container">
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    {
                                        array.map((itemValue) => (
                                            <div style={{
                                                height: 400,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-end",
                                                zIndex:"2",
                                            }}>
                                                {giveMeObject(itemValue)}
                                                <div className="box-item-starter"></div>
                                                <div className="box-stick"></div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default BoxComponent;