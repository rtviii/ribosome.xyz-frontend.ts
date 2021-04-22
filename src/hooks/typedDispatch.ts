import {useDispatch} from "react-redux";
import {AppActions} from './../redux/AppActions'

type   Dispatch                =  <TRet>(action: AppActions) => TRet;
export const useTypedDispatch  =  () => useDispatch<Dispatch>();