import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./productList.css";
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import { MetaData } from '../MetaData';
import { Delete, Edit } from '@material-ui/icons';
import { Sidebar } from './Sidebar';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { deleteUser, getAllUsers,clearErrors } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';

export const UserList = ({ history }) => {

    const { error, users} = useSelector((state) => state.allUsers);
    const {error:deleteError,isDeleted,message}=useSelector((state)=>state.profile);


    const dispatch = useDispatch();
    const alert = useAlert();

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success(message);
            history.push('/admin/users')
            dispatch({ type: DELETE_USER_RESET })
        }
        dispatch(getAllUsers());
    }, [dispatch, alert, error, history,deleteError,message,isDeleted]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }


    const columns = [
        { field: "id", headerName: "User ID", minWidth: 200, flex: 0.6 },
        { field: "email", headerName: "Email", minWidth: 250, flex: 0.7 },
        { field: "name", headerName: "Name", minWidth: 100, flex: 0.3 },
        { field: "role", headerName: "Role", type: "number", minWidth: 100, flex: 0.3 },
        {
            field: "action", headerName: "Action", type: "number", sortable: false, minWidth: 150, flex: 0.3, renderCell: (params) => {
                return (<>
                    <Link to={`/admin/user/${params.getValue(params.id, "id")}`}><Edit /></Link>
                    <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}><Delete /></Button>
                </>)
            }
        }
    ]

    const rows = [];

    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            role: item.role,
            email: item.email
        })
    });

    return <>
        <MetaData title={`All users -Admin`} />
        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 className="productListHeading">ALL USERS</h1>

                <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight />
            </div>
        </div>
    </>;
};
