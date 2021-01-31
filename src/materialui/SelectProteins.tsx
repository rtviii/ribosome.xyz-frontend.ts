import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import {large_subunit_map} from './../static/large-subunit-map'
import {small_subunit_map} from './../static/small-subunit-map'
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {mapDispatchFilter, mapStateFilter} from './../components/Workspace/Display/StructuresCatalogue'
import { connect, useStore  } from "react-redux";
