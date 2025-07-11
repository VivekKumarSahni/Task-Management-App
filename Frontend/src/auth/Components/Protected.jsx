import { useSelector } from "react-redux";
import { selectLoggedInuserToken, selectUserChecked } from "../authSlice";
import { Navigate } from "react-router-dom";

export default function Protected({children}) {
    const user = useSelector(selectLoggedInuserToken)
    if(!user ){
return <Navigate to='/login' replace={true}></Navigate>
    }
    return children;
}