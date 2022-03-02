import React from 'react';
import logo from '../../images/logo2.png'
import { Link } from 'react-router-dom';
import './sidebar.css'
import { TreeItem, TreeView } from '@material-ui/lab'
import { ExpandMore, PostAdd, Add, ChevronRight, ListAlt, Dashboard, People, RateReview } from '@material-ui/icons'

export const Sidebar = () => {
    return <>
        <div className="sidebar">
            <Link to="/"><img src={logo} alt="Ecommerce" /></Link>
            <Link to="/admin/dashboard">
                <p><Dashboard />Dashboard</p>
            </Link>
            <div className="tree">
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                >
                    <TreeItem nodeId='1' label="Products">
                        <Link to="/admin/products">
                            <TreeItem nodeId='2' label="All" icon={<PostAdd />} />
                        </Link>
                        <Link to="/admin/product">
                            <TreeItem nodeId='4' label="Create" icon={<Add />} />
                        </Link>
                    </TreeItem>
                </TreeView>
            </div>
            <Link to="/admin/orders">
                <p>
                    <ListAlt />
                    Orders
                </p>
            </Link>
            <Link to="/admin/users">
                <p>
                    <People />
                    Users
                </p>
            </Link>
            <Link to="/admin/reviews">
                <p>
                    <RateReview />
                    Reviews
                </p>
            </Link>
        </div>
    </>
};
