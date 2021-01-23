import React, { useEffect } from 'react'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { AppActions } from "../../../redux/AppActions";
import * as redux from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { ThunkDispatch } from "redux-thunk";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {useDebounce} from 'use-debounce'

interface filterchangeProp {
    handleChange: (newval:string)=>void;
}

export const mapdispatch = (
  dispatch: Dispatch<AppActions>,
  ownprops: {}
): filterchangeProp => ({
  handleChange: (inputval: string) => dispatch(redux.filterOnPdbid(inputval)),
});


// Search
const SearchField:React.FC<filterchangeProp> = (prop:filterchangeProp)=> {


  const [name, setName] = React.useState("");
  const [value] = useDebounce(name, 250)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newval = event.target.value
    setName(newval);
  };

  useEffect(() => {
    prop.handleChange(value)
  }, [value])

  return (
    <form  noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Search</InputLabel>
        <Input id="component-simple" value={name} onChange={handleChange} />
      </FormControl>
    </form>
  );
}

connect(null, mapdispatch)(SearchField);